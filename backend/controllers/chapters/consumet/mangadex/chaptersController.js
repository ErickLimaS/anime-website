const expressAsyncHandler = require("express-async-handler")
const setRedisKey = require("../../../redisUtils").setRedisKey;

exports.getChaptersByMediaId = (req, res) => expressAsyncHandler(async (req, res) => {

    const mediaId = req.query.id;

    const CONSUMET_MEDIA_CHAPTERS_URI = process.env.CONSUMET_API_URL + "/manga/mangadex/info/" + mediaId

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "chapters:manga:consumet:mangadex:" + mediaId.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Chapters for: ${mediaId.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_MEDIA_CHAPTERS_URI)
            .then(response => response.json())
            .then(data => {
                results = data.chapters || [];
                console.log("Results:", results);
                if (results.length === 0) {
                    return res.status(404).json({ message: "No chapters found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Mangadex API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Results for: ${mediaId.toUpperCase()}`, results: results
        });

    }
    catch (err) {
        console.error("Error in /chapters/consumet/mangadex/all route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

exports.getChapterUrl = (req, res) => expressAsyncHandler(async (req, res) => {

    const chapterId = req.query.id;

    const CONSUMET_MEDIA_CHAPTER_URI = process.env.CONSUMET_API_URL + "/manga/mangadex/read/" + chapterId

    const redisClient = req.redisClient;

    try {

        let results = null

        const key = "chapter:manga:consumet:mangadex:" + chapterId.toLowerCase();

        const value = await redisClient.get(key);

        if (value) {
            console.log("Cache HIT for key:", key);

            return res.status(202).json({
                message: `Chapter for: ${chapterId.toUpperCase()}`, results: JSON.parse(value)
            });
        }

        console.log("Cache MISS for key:", key);

        await fetch(CONSUMET_MEDIA_CHAPTER_URI)
            .then(response => response.json())
            .then(data => {
                results = data.episodes || [];
                if (results.length === 0) {
                    return res.status(404).json({ message: "Chapter not found", results: results });
                }
            })
            .catch(err => {
                console.error("Error fetching data from Mangadex API:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            });

        await setRedisKey({ redisClient, key, data: results });

        return res.status(200).json({
            message: `Results for: ${chapterId.toUpperCase()}`, results: results
        });

    }
    catch (err) {
        console.error("Error in /chapters/consumet/mangadex/chapter route: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})