const express = require("express")
const consumetMangadexChaptersController = require("../controllers/chapters/consumet/mangadex/chaptersController");

const mediaChaptersRoute = express.Router();

mediaChaptersRoute.get("/consumet/mangadex/chapter", consumetMangadexChaptersController.getChapterUrl())
mediaChaptersRoute.get("/consumet/mangadex/all", consumetMangadexChaptersController.getChaptersByMediaId())

module.exports = mediaChaptersRoute     