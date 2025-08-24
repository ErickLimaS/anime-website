const expressAsyncHandler = require("express-async-handler")
const setRedisKey = require("../../redisUtils").setRedisKey;
const { requestMedias } = require("../../anilistUtils/queryConstants")
const fetchOptions = require("../../anilistUtils/utils").fetchOptions;

exports.searchAnimeOnAnilist = (req, res) => expressAsyncHandler(async (req, res) => {

    const ANILIST_MEDIA_INFO_URI = process.env.ANILIST_API_URL

    // Anilist USES GraphQL for Queries

    const fetchByType = !req.url.includes("any") // if URL has ANY, it doesnt use TYPE or FORMAT as parameter

    const reqQuery = req.query.query;  // MEDIA ID 
    const showAdultContent = req.query.showAdultContent == "true" || false;
    const type = req.query.type || "ANIME";  // ANIME or MANGA
    const format = req.query.format || "TV"; // TV TV_SHORT MOVIE SPECIAL OVA ONA MUSIC MANGA NOVEL ONE_SHOT
    const sort = req.query.sort || "TRENDING_DESC";
    const season = req.query.season || null;
    const seasonYear = req.query.seasonYear || null;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 15;

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = `search:any:anilist:page-${page}:per-page-${perPage}:${reqQuery}`;
        // const key = `search:anime:anilist:page-${page}:per-page-${perPage}:${reqQuery}`;
        // const key = `search:manga:anilist:page-${page}:per-page-${perPage}:${reqQuery}`;

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Results for: ${reqQuery}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        const graphqlQuery = {
            query: requestMedias(", $search: String", ", search: $search"),
            variables: {
                search: reqQuery,
                showAdultContent: showAdultContent,
                type: fetchByType ? type : undefined,
                format: fetchByType ? format : undefined,
                page: page,
                sort: sort,
                perPage: perPage,
                season: season,
                seasonYear: seasonYear
            },
        };

        await fetch(ANILIST_MEDIA_INFO_URI, fetchOptions({ graphqlQuery, authToken: req.query.authToken }))
            .then(response => response.json())
            .then(data => {

                if (!data.data) {
                    return res.status(data.errors[0].status).json(data.errors)
                }

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
            message: `Results for: ${reqQuery}, page ${page}`, results: results
        });


    }
    catch (err) {
        console.error("Error in /search/anime/anilist route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})