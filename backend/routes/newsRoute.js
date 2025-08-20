const express = require('express');
const getAllNewsOnAnimeNewsNetworkController = require('../controllers/news/consumet/animeNewsNetwork/allNewsController');
const getNewsByIdOnAnimeNewsNetwork = require('../controllers/news/consumet/animeNewsNetwork/newsByIdController');

const newsRoute = express.Router();

newsRoute.get('/consumet/ann/all', getAllNewsOnAnimeNewsNetworkController.getAllNewsOnAnimeNewsNetwork);
newsRoute.get('/consumet/ann', getNewsByIdOnAnimeNewsNetwork.getNewsByIdOnAnimeNewsNetwork)

module.exports = newsRoute; 