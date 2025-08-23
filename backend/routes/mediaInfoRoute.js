const express = require("express")

const mediaInfoRoute = express.Router();

const mediaInfoOnZoroController = require("../controllers/mediaInfo/consumet/zoro/mediaInfoController");
const mediaInfoOnGogoanimeController = require("../controllers/mediaInfo/consumet/gogoanime/mediaInfoController");
const mediaInfoOnAnilistController = require("../controllers/mediaInfo/anilist/mediaInfoController");

// Get Media Info => ?query=xxx
mediaInfoRoute.get("/anime/consumet/zoro", mediaInfoOnZoroController.getMediaInfoOnZoro)
mediaInfoRoute.get("/anime/consumet/gogoanime", mediaInfoOnGogoanimeController.getMediaInfoOnGogoanime)
mediaInfoRoute.get("/anime/anilist", mediaInfoOnAnilistController.geMediaInfoOnAnilist)

module.exports = mediaInfoRoute