const expressAsyncHandler = require("express-async-handler");
const setRedisKey = require("../../../redisUtils").setRedisKey;

exports.getMediaInfoOnGogoanime = expressAsyncHandler(async (req, res) => {

    const reqQuery = req.query.query;

    const CONSUMET_MEDIA_INFO_URI = process.env.CONSUMET_API_URL + "/anime/gogoanime/info/" + reqQuery

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "mediaInfo:anime:gogoanime:" + reqQuery.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Media Info for ID: ${reqQuery}`, result: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_MEDIA_INFO_URI)
            .then(response => response.json())
            .then(data => {
                results = data || null;
                if (!results) {
                    return res.status(404).json({ message: "No results found", result: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Gogoanime API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Media Info for ID: ${reqQuery}`, result: results
        });

    }
    catch (err) {

        console.error("Error in /mediaInfo/anime/consumet/gogoanime route: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});