const express = require("express")
const searchOnZoroController = require("../controllers/search/consumet/zoro/searchController");
const searchOnGogoanimeController = require("../controllers/search/consumet/gogoanime/searchController");
const searchOnMangadexController = require("../controllers/search/consumet/mangadex/searchController");
const searchOnAniwatchController = require("../controllers/search/aniwatch/searchController");
const searchOnAnilistController = require("../controllers/search/anilist/searchController");
const searchOnAnimeDatabaseController = require("../controllers/search/anime-database/searchController");

const searchRoute = express.Router();

// Search Anime
searchRoute.get("/any/anilist", searchOnAnilistController.searchAnimeOnAnilist()) // ?query=xxx&showAdultContent=false&type=ANIME&format=TV&sort=TRENDING_DESC&season=null&seasonYear=null&page=1&perPage=15
searchRoute.get("/anime/anilist", searchOnAnilistController.searchAnimeOnAnilist()) // ?query=xxx&showAdultContent=false&type=ANIME&format=TV&sort=TRENDING_DESC&season=null&seasonYear=null&page=1&perPage=15
searchRoute.get(`/anime/aniwatch`, searchOnAniwatchController.searchAnimeOnAniwatch())
searchRoute.get("/anime/consumet/zoro", searchOnZoroController.searchAnimeOnZoro())
searchRoute.get(`/anime/consumet/gogoanime`, searchOnGogoanimeController.searchAnimeOnGogoanime())
searchRoute.get(`/media/anime-database`, searchOnAnimeDatabaseController.searchMediasOnAnimeDatabase())

// Search Manga 
searchRoute.get(`/manga/consumet/mangadex/:query`, searchOnMangadexController.searchMangaOnMangadex())

module.exports = searchRoute 