const expressAsyncHandler = require('express-async-handler');
const setRedisKey = require("../../../redisUtils").setRedisKey;

exports.getAllNewsOnAnimeNewsNetwork = expressAsyncHandler(async (req, res) => {

    const CONSUMET_NEWS_URI = process.env.CONSUMET_API_URL + `/news/ann/recent-feeds${req.query.topic ? `?topic=${req.query.topic}` : ""}`

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "news:consumet:AnimeNewsNetwork";

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `ALL NEWS:`, result: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_NEWS_URI)
            .then(response => response.json())
            .then(data => {
                results = data || null;
                if (!results) {
                    return res.status(404).json({ message: "No results found", result: results });
                }
            })
            .catch(err => {
                console.error("Error fetching News from Consumet:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `ALL NEWS: `, result: results
        });

    }
    catch (err) {
        console.error("Error in /news/consumet/ann/all route: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

})