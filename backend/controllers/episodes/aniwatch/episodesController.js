const expressAsyncHandler = require("express-async-handler");
const setRedisKey = require("../../redisUtils").setRedisKey;

exports.getEpisodesByMediaId = (req, res) => expressAsyncHandler(async (req, res) => {

    const mediaId = req.query.id;

    const ANIWATCH_SEARCH_URI = process.env.ANIWATCH_API_URL + `/api/v2/hianime/anime/${mediaId}/episodes`

    const redisClient = req.redisClient;

    if (!mediaId) {
        return res.status(400).json({ error: "Media ID is required" });
    }

    try {

        let results = null

        const key = "episodes:anime:aniwatch:" + mediaId.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Episodes for: ${mediaId.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(ANIWATCH_SEARCH_URI)
            .then(response => response.json())
            .then(data => {
                results = data.data.episodes || [];
                if (results.length === 0) {
                    return res.status(404).json({ message: "No results found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Aniwatch API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Results for: ${mediaId.toUpperCase()}`, results: results
        });

    }
    catch (err) {
        console.error("Error in /episodes/anime/aniwatch route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

exports.getEpisodeUrl = (req, res) => expressAsyncHandler(async (req, res) => {

    const episodeId = req.query.id;
    const category = req.query.category || "sub";
    const server = req.query.server || null;

    const ANIWATCH_SEARCH_URI = process.env.ANIWATCH_API_URL + `/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}${server ? `&server=${server}` : ""}${category ? `&category=${category}` : ""}`

    const redisClient = req.redisClient;

    if (!episodeId) {
        return res.status(400).json({ error: "Episode ID is required" });
    }

    try {

        let results = null

        let key = "episode:anime:aniwatch:" + episodeId.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Episodes for: ${episodeId.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(ANIWATCH_SEARCH_URI)
            .then(response => response.json())
            .then(data => {
                results = data.data || [];
                if (results.length === 0) {
                    return res.status(404).json({ message: "No results found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Aniwatch API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Results for: ${episodeId.toUpperCase()}`, results: results
        });

    }
    catch (err) {
        console.error("Error in /episodes/anime/aniwatch/episode route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})