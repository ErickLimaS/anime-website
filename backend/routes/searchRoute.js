const express = require("express")
const searchOnZoroController = require("../controllers/search/consumet/zoro/searchController");
const searchOnMangadexController = require("../controllers/search/consumet/mangadex/searchController");
const searchOnAniwatchController = require("../controllers/search/aniwatch/searchController");

const searchRoute = express.Router();

// Search Anime
searchRoute.get(`/anime/aniwatch`, searchOnAniwatchController.searchAnimeOnAniwatch())
searchRoute.get("/anime/consumet/zoro", searchOnZoroController.searchAnimeOnZoro())
// searchRoute.get(`/anime/anilist`, searchOnZoroController.searchAnimeOnZoro()) under development
// searchRoute.get(`/anime/consumet/gogoanime`, searchOnZoroController.searchAnimeOnZoro()) currently not working on consumet side

// Search Manga 
searchRoute.get(`/manga/consumet/mangadex/:query`, searchOnMangadexController.searchMangaOnMangadex())

module.exports = searchRoute 