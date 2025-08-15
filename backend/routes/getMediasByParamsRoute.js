const express = require('express')
const mediasByParamsController = require('../controllers/getMedias/anilist/mediasByParamsController');

const mediasByFormatRoute = express.Router();

// ANILIST API ONLY
// Route to get TYPE anime or manga by format
// format values available: TV_SHORT, MOVIE, SPECIAL, OVA, ONA, MUSIC, MANGA, NOVEL, ONE_SHOT
// Example: /medias/anime/TV?page=1&perPage=15&showAdultContent=true&sort=TRENDING_DESC&season=WINTER&seasonYear=2023
mediasByFormatRoute.get('/anime/:format', mediasByParamsController.mediasByParamsOnAnilist); 
mediasByFormatRoute.get('/manga/:format', mediasByParamsController.mediasByParamsOnAnilist); 

module.exports = mediasByFormatRoute