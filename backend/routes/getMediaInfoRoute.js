const express = require("express")

const mediaInfoRoute = express.Router();

const mediaInfoOnZoroController = require("../controllers/mediaInfo/consumet/zoro/mediaInfoController");
const mediaInfoOnAnilistController = require("../controllers/mediaInfo/anilist/mediaInfoController");

// Get Media Info => ?query=xxx
mediaInfoRoute.get("/anime/consumet/zoro", mediaInfoOnZoroController.getMediaInfoOnZoro) 
mediaInfoRoute.get("/anime/anilist", mediaInfoOnAnilistController.geMediaInfoOnAnilist)

module.exports = mediaInfoRoute