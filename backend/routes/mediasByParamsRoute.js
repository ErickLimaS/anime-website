const express = require('express')
const mediasByParamsController = require('../controllers/medias/anilist/mediasByParamsController');

const mediasByFormatRoute = express.Router();

// ANILIST API ONLY

// Route to get TYPE anime or manga by format
// format available: TV_SHORT, MOVIE, SPECIAL, OVA, ONA, MUSIC, MANGA, NOVEL, ONE_SHOT
// status available: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS"
// Example: /medias/anime/TV?page=1&perPage=15&showAdultContent=true&sort=TRENDING_DESC&season=WINTER&seasonYear=2023&status=FINISHED
mediasByFormatRoute.get('/anime', mediasByParamsController.mediasByParamsOnAnilist);
mediasByFormatRoute.get('/anime/:format', mediasByParamsController.mediasByParamsOnAnilist);
mediasByFormatRoute.get('/manga', mediasByParamsController.mediasByParamsOnAnilist);
mediasByFormatRoute.get('/manga/:format', mediasByParamsController.mediasByParamsOnAnilist);
mediasByFormatRoute.get('/movie', mediasByParamsController.mediasByParamsOnAnilist);
mediasByFormatRoute.get('/movie/:format', mediasByParamsController.mediasByParamsOnAnilist);

mediasByFormatRoute.get('/latest-releases', mediasByParamsController.mediasByParamsOnAnilist);

mediasByFormatRoute.get('/trending', mediasByParamsController.mediasByParamsOnAnilist); 

module.exports = mediasByFormatRoute