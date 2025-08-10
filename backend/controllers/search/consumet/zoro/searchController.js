const expressAsyncHandler = require("express-async-handler")

exports.searchAnimeOnZoro = (req, res) => expressAsyncHandler(async (req, res) => {

    const CONSUMET_SEARCH_URI = process.env.CONSUMET_API_URL + "/anime/zoro/" + req.query.query

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "search:anime:" + req.query.query.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Results for: ${req.query.query.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_SEARCH_URI)
            .then(response => response.json())
            .then(data => {
                results = data.results || [];
                if (results.length === 0) {
                    return res.status(404).json({ message: "No results found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Zoro API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });


        await redisClient.set(key, JSON.stringify(results), {
            type: "EX",
            value: process.env.REDIS_EXPIRATION
        })

        return res.status(200).json({
            message: `Results for: ${req.query.query.toUpperCase()}`, results: results
        });


    }
    catch (err) {
        console.error("Error in /search/anime/consumet/zoro route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})