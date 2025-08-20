const express = require("express")
const aniwatchEpisodesController = require("../controllers/episodes/aniwatch/episodesController");
const consumetZoroEpisodesController = require("../controllers/episodes/consumet/zoro/episodesController");
const consumetGogoanimeEpisodesController = require("../controllers/episodes/consumet/gogoanime/episodesController");

const mediaEpisodesRoute = express.Router();

mediaEpisodesRoute.get("/aniwatch/episode", aniwatchEpisodesController.getEpisodeUrl())
mediaEpisodesRoute.get("/aniwatch/all", aniwatchEpisodesController.getEpisodesByMediaId())

mediaEpisodesRoute.get("/consumet/gogoanime/episode", consumetGogoanimeEpisodesController.getEpisodeUrl())
mediaEpisodesRoute.get("/consumet/gogoanime/all", consumetGogoanimeEpisodesController.getEpisodesByMediaId())
mediaEpisodesRoute.get("/consumet/zoro/episode", consumetZoroEpisodesController.getEpisodeUrl())
mediaEpisodesRoute.get("/consumet/zoro/all", consumetZoroEpisodesController.getEpisodesByMediaId())

module.exports = mediaEpisodesRoute     