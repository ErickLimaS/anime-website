const express = require('express');
const imdbController = require('../controllers/imdb/consumet/imdbController');

const imdbRoute = express.Router();

imdbRoute.get('/search', imdbController.searchMediaInfoOnImdb);
imdbRoute.get('/media-info', imdbController.getMediaInfoOnImdb)

module.exports = imdbRoute; 