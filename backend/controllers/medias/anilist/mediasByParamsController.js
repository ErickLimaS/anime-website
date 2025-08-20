const expressAsyncHandler = require("express-async-handler");
const setRedisKey = require("../../redisUtils").setRedisKey;
const { requestMedias, requestMediasByTrendingSort, requestMediasByDateRelease } = require("../../anilistUtils/queryConstants")
const fetchOptions = require("../../anilistUtils/utils").fetchOptions;
const getMediaFormatByType = require("../../anilistUtils/utils").getMediaFormatByType;
const anilistMediasTypes = require("../../anilistUtils/utils").anilistMediasTypes;
const { getDateInUnixTimestamp } = require("./utils");

exports.mediasByParamsOnAnilist = expressAsyncHandler(async (req, res) => {

    const ANILIST_MEDIA_INFO_URI = process.env.ANILIST_API_URL

    const currRoute = (() => {

        const routesUsedOnThisController = [
            '/anime',
            '/manga',
            '/movie',
            '/latest-releases',
            '/trending'
        ];

        return routesUsedOnThisController.find((item) => req.url.includes(item))

    })()

    // Anilist USES GraphQL for Queries

    // PARAMS
    const releasedOnLastXDays = req.query.releasedOnLastXDays || null;
    const showOnlyReleasesOnThisDate = releasedOnLastXDays ? req.query.showOnlyReleasesOnThisDate == "true" : undefined;
    const sort = releasedOnLastXDays ? "TIME_DESC" : req.query.sort || "TRENDING_DESC";
    const showAdultContent = req.query.showAdultContent === 'true';
    const type = anilistMediasTypes.find((item) => item == req.url.slice(1, 6).toUpperCase()) ? req.url.slice(1, 6).toUpperCase() : "ANIME";
    const format = getMediaFormatByType({ type, formatOnParams: req.params.format });
    const status = req.query.status?.toUpperCase() || undefined; // only for latest-releases route
    const season = req.query.season || undefined;
    const seasonYear = req.query.seasonYear || undefined;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 15;

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = `medias:${type.toLowerCase()}:anilist:page-${page}:per-page-${perPage}:format-${format.toLowerCase()}:type-${type.toLowerCase()}:status-${status?.toLowerCase()}:sort-${sort?.toLowerCase()}:releasedOnLastXDays-${releasedOnLastXDays}:season-${season?.toLowerCase()}:seasonYear-${seasonYear}:showAdultContent-${showAdultContent}`;

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Results for ${type}-${format}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        const queryByRoute = () => {
            switch (currRoute) {
                case '/anime':
                case '/manga':
                case '/movie':

                    if (releasedOnLastXDays) return requestMediasByDateRelease();

                    return requestMedias();

                case '/latest-releases':
                    return requestMedias();
                case '/trending':
                    return requestMediasByTrendingSort();
                default:
                    throw new Error("Invalid route");
            }
        }

        const graphqlQuery = {
            query: queryByRoute(),
            variables: {
                showAdultContent: showAdultContent,
                type: type,
                // format: req.params.format ? format : "TV",
                status: status || undefined,
                page: page,
                sort: sort,
                perPage: perPage,
                season: season,
                seasonYear: seasonYear,
                airingAt_greater: getDateInUnixTimestamp({ daysAgo: releasedOnLastXDays, startWithTheFirstHour: true }),
                airingAt_lesser: getDateInUnixTimestamp({ daysAgo: showOnlyReleasesOnThisDate ? releasedOnLastXDays : 0 }), // 0 returns today's timestamp
            },
        };

        await fetch(ANILIST_MEDIA_INFO_URI, fetchOptions({ graphqlQuery, authToken: req.query.authToken }))
            .then(response => response.json())
            .then(data => {

                if (!data.data) {
                    return res.status(data.errors[0].status).json(data.errors)
                }

                results = data.data.Page?.media || data.data.Page?.mediaTrends || data.data.Page?.airingSchedules || [];

                if (results.length === 0) {
                    return res.status(404).json({ message: "No results found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Anilist API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `${currRoute}: Results for ${type}-${format}, page ${page}`, results: results
        });


    }
    catch (err) {

        console.error(`Error in /medias${currRoute} route: `, err);

        return res.status(500).json({ error: `Internal Server Error! Route /medias${currRoute} ` });
    }

})