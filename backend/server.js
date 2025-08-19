const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const redis = require("redis");
const searchRoute = require('./routes/searchRoute');
const mediaInfoRoute = require('./routes/getMediaInfoRoute');
const mediasByParamsRoute = require('./routes/getMediasByParamsRoute');
const newsRoute = require('./routes/getNews');
const mediaEpisodesRoute = require('./routes/mediaEpisodesRoute');
const imdbRoute = require('./routes/imdbRoute');

const redisClient = redis.createClient();

(async () => {

    redisClient.on("error", (err) => {
        console.error("#### -> Redis Client Error! ", err);
    })

    redisClient.on("ready", () => {
        console.log("#### -> Redis Client is ready!");
    })

    await redisClient.connect();

    await redisClient.ping()

})()

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AniProject API Server!' });
});

app.use("/search", searchRoute)
app.use("/media-info", mediaInfoRoute)
app.use("/medias", mediasByParamsRoute)
app.use("/episodes", mediaEpisodesRoute)
app.use("/news", newsRoute)
app.use("/imdb", imdbRoute)

// Start server
app.listen(port, () => {
    console.log(`#### -> Server is live! Running on port: ${port}`);
});