const expressAsyncHandler = require("express-async-handler");
const { requestMediaById } = require("../../anilistUtils/queryConstants")
const setRedisKey = require("../../redisUtils").setRedisKey;
const handleResponse = require("../../anilistUtils/utils").handleResponse;
const handleError = require("../../anilistUtils/utils").handleError;
const fetchOptions = require("../../anilistUtils/utils").fetchOptions;

exports.geMediaInfoOnAnilist = expressAsyncHandler(async (req, res) => {

    // Anilist USES GraphQL for Queries

    const reqQuery = req.query.query;  // MEDIA ID 
    const lang = req.query.lang || "ENGLISH";

    const ANILIST_MEDIA_INFO_URI = process.env.ANILIST_API_URL

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "mediaInfo:any:anilist:" + reqQuery + ":lang-" + lang.toLowerCase();

        const value = req.query?.authToken ? null : await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Media Info for ID: ${reqQuery}`, result: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        const graphqlQuery = {
            query: requestMediaById(req.query?.authToken ? true : false),
            variables: {
                id: reqQuery,
            },
        };

        await fetch(ANILIST_MEDIA_INFO_URI, fetchOptions({ graphqlQuery, authToken: req.query.authToken }))
            .then(handleResponse)
            .then(data => {
                if (!data.data) {
                    return res.status(data.errors[0].status).json(data.errors)
                }

                results = data.data.Media || null;

                if (!results) {
                    return res.status(404).json({ message: "No results found", result: results });
                }
            })
            .catch((error => handleError({ error, res })));

        if (!req.query?.authToken) await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Media Info for ID: ${reqQuery}`, result: results
        });

    }
    catch (err) {
        console.error("Error in /mediaInfo/anime/anilist route: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

})