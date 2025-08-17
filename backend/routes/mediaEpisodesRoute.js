const express = require("express")
const episodesController = require("../controllers/episodes/aniwatch/episodesController");

const mediaEpisodesRoute = express.Router();

mediaEpisodesRoute.get("/aniwatch/episode", episodesController.getEpisodeUrl())
mediaEpisodesRoute.get("/aniwatch/all", episodesController.getEpisodesByMediaId())

module.exports = mediaEpisodesRoute    