const expressAsyncHandler = require("express-async-handler")
const setRedisKey = require("../../redisUtils").setRedisKey;
const animeDataOffline = require("./anime-offline-database-minified.json")

function getMediasWithAnilistId(medias) {

    let newMediaListWithAnilistId = medias.filter((media) =>
        media.sources.map((source) => {
            if (source.includes("https://anilist.co/anime")) {

                // Extract the Anilist ID from the URL
                const urlWithAnilistId = source.slice(source.search(/\banime\b/));

                // Set the anilistId property on the media object. It will be used later for fetching more details on website
                media.anilistId = urlWithAnilistId.slice(6);
            }
        })
    )

    // Filter out any media that does not have an anilistId
    newMediaListWithAnilistId = newMediaListWithAnilistId.filter((item) => item.anilistId);

    return newMediaListWithAnilistId;

}

exports.searchMediasOnAnimeDatabase = (req, res) => expressAsyncHandler(async (req, res) => {

    let results = animeDataOffline.data;
    let totalQueryResultsLength = 0;
    const lastUpdateDate = animeDataOffline.lastUpdate;

    const resultsPerPageLimit = 12;

    const page = req.query.page || 1;
    const type = req.query.type; // [TV, MOVIE, OVA, ONA, SPECIAL, UNKNOWN]
    const year = req.query.year;
    const genre = req.query.genre;
    const status = req.query.status; // [FINISHED, ONGOING, UPCOMING, UNKNOWN]
    const title = req.query.title;
    const season = req.query.season; //  [SPRING, SUMMER, FALL, WINTER, UNDEFINED]
    const sort = req.query.sort || "releases_desc"; // [releases_desc, releases_asc, title_desc, title_asc]

    const responseMessage = `Results from Anime Database: ${type ? type : ""} ${year ? year : ""} ${genre ? genre : ""} ${status ? status : ""} ${title ? title : ""} ${season ? season : ""} ${sort ? sort : ""}`

    const redisClient = req.redisClient;

    const key = `search:medias:animedatabase:title=${title}:type=${type}:year=${year}:genre=${genre}:status=${status}:season=${season}:sort=${sort}:page=${page}`;

    const value = await redisClient.get(key);

    if (value) {
        console.log("Cache HIT for key:", key);

        return res.status(202).json({
            message: responseMessage,
            results: JSON.parse(value),
            allResultsLength: 0,
            lastUpdate: lastUpdateDate,
        });
    }

    console.log("Cache MISS for key:", key);

    if (type) {
        results = results.filter(media => media.type.toLowerCase() === type.toLowerCase());
    }
    if (year) {
        results = results.filter(media => media.animeSeason.year === parseInt(year));
    }
    if (genre) {
        results = results.filter(media =>
            media.tags.some((genreName) => genre.includes(genreName)));
    }
    if (status) {
        results = results.filter(media => media.status.toLowerCase() === status.toLowerCase());
    }
    if (title) {
        results = results.filter(media => media.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (season) {
        results = results.filter(
            media => media.animeSeason.season.toLocaleLowerCase() == season.toLocaleLowerCase());
    }

    switch (sort) {
        case "releases_desc":
            results = results.sort((a, b) => a.animeSeason.year - b.animeSeason.year).reverse();

            break;

        case "releases_asc":
            results = results.sort((a, b) => a.animeSeason.year - b.animeSeason.year);

            break;

        case "title_desc":
            results = results.sort((a, b) => a.title > b.title ? -1 : 1);

            break;

        case "title_asc":
            results = results.sort((a, b) => (a.title > b.title ? -1 : 1)).reverse();

            break;

        default:
            break;
    }

    if (results.length == 0) {
        return res.status(404).json({
            message: "No results found",
            results: [],
            allResultsLength: 0,
            lastUpdate: lastUpdateDate,
        });
    }

    results = getMediasWithAnilistId(results);

    // Query Results Length
    totalQueryResultsLength = results.length;

    // Pagination
    results = results.slice(0, page * resultsPerPageLimit);

    await setRedisKey({ redisClient, key, data: results });

    return res.status(200).json({
        message: responseMessage,
        results: results,
        allResultsLength: totalQueryResultsLength == 0 ? undefined : totalQueryResultsLength,
        lastUpdate: lastUpdateDate,
    })

})