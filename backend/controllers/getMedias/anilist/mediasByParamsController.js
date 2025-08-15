const expressAsyncHandler = require("express-async-handler");
const setRedisKey = require("../../redisUtils").setRedisKey;
const { requestMedias } = require("../../anilistUtils/queryConstants")
const fetchOptions = require("../../anilistUtils/utils").fetchOptions;
const getMediaFormatByType = require("../../anilistUtils/utils").getMediaFormatByType;
const anilistMediasTypes = require("../../anilistUtils/utils").anilistMediasTypes;

exports.mediasByParamsOnAnilist = expressAsyncHandler(async (req, res) => {

    const ANILIST_MEDIA_INFO_URI = process.env.ANILIST_API_URL

    // Anilist USES GraphQL for Queries

    const showAdultContent = req.query.showAdultContent === 'true';
    const type = anilistMediasTypes.find((item) => item == req.url.slice(1, 6).toUpperCase()) ? req.url.slice(1, 6).toUpperCase() : "ANIME";
    const format = getMediaFormatByType({ type, formatOnParams: req.params.format });
    const status = req.query.status?.toUpperCase() || undefined; // only for latest-releases route
    const sort = req.query.sort || "TRENDING_DESC";
    const season = req.query.season || null;
    const seasonYear = req.query.seasonYear || null;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 15;

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = `medias:${type.toLowerCase()}:anilist:page-${page}:per-page-${perPage}:format-${format.toLowerCase()}:type-${type.toLowerCase()}:status-${status?.toLowerCase()}:sort-${sort?.toLowerCase()}:season-${season?.toLowerCase()}:seasonYear-${seasonYear}:showAdultContent-${showAdultContent}`;

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Results for ${type}-${format}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        const graphqlQuery = {
            query: requestMedias(),
            variables: {
                showAdultContent: showAdultContent,
                type: type,
                format: format,
                status: status || undefined,
                page: page,
                sort: sort,
                perPage: perPage,
                season: season,
                seasonYear: seasonYear
            },
        };

        await fetch(ANILIST_MEDIA_INFO_URI, fetchOptions({ graphqlQuery }))
            .then(response => response.json())
            .then(data => {
                results = data.data.Page.media || [];
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
            message: `Results for ${type}-${format}, page ${page}`, results: results
        });


    }
    catch (err) {

        if (req.url.includes('/latest-releases')) console.error("Error in /medias/latest-releases route: ", err);
        else console.error("Error in /medias/:format route: ", err);

        res.status(500).json({ error: "Internal Server Error" });
    }


})