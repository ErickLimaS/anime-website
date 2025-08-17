const express = require("express")
const aniwatchEpisodesController = require("../controllers/episodes/aniwatch/episodesController");
const consumetZoroEpisodesController = require("../controllers/episodes/consumet/zoro/episodesController");

const mediaEpisodesRoute = express.Router();

mediaEpisodesRoute.get("/aniwatch/episode", aniwatchEpisodesController.getEpisodeUrl())
mediaEpisodesRoute.get("/aniwatch/all", aniwatchEpisodesController.getEpisodesByMediaId())

mediaEpisodesRoute.get("/consumet/zoro/episode", consumetZoroEpisodesController.getEpisodeUrl())
mediaEpisodesRoute.get("/consumet/zoro/all", consumetZoroEpisodesController.getEpisodesByMediaId())

module.exports = mediaEpisodesRoute     