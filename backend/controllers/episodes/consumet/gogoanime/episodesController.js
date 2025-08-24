const expressAsyncHandler = require("express-async-handler")
const setRedisKey = require("../../../redisUtils").setRedisKey;

exports.getEpisodesByMediaId = (req, res) => expressAsyncHandler(async (req, res) => {

    const mediaId = req.query.id;

    const CONSUMET_MEDIA_EPISODES_URI = process.env.CONSUMET_API_URL + "/anime/gogoanime/info?id=" + mediaId

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "episodes:anime:consumet:gogoanime:" + mediaId.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Episodes for: ${mediaId.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_MEDIA_EPISODES_URI)
            .then(response => response.json())
            .then(data => {
                results = data.episodes || [];
                if (results.length === 0) {
                    return res.status(404).json({ message: "No episodes found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Zoro API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Results for: ${mediaId.toUpperCase()}`, results: results
        });

    }
    catch (err) {
        console.error("Error in /episodes/anime/consumet/zoro/all route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

exports.getEpisodeUrl = (req, res) => expressAsyncHandler(async (req, res) => {

    const episodeId = req.query.id;

    const CONSUMET_MEDIA_EPISODE_URI = process.env.CONSUMET_API_URL + "/anime/gogoanime/watch/" + episodeId

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "episode:anime:consumet:gogoanime:" + episodeId.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Episode for: ${episodeId.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_MEDIA_EPISODE_URI)
            .then(response => response.json())
            .then(data => {
                results = data || [];
                console.log(data)
                if (data.message.status == 404) {
                    return res.status(404).json({ message: "No episode found", results: results });
                }
                if (results.length === 0) {
                    return res.status(404).json({ message: "No episode found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Gogoanime API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Results for: ${episodeId.toUpperCase()}`, results: results
        });

    }
    catch (err) {
        console.error("Error in /episodes/anime/consumet/gogoanime/episode route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})