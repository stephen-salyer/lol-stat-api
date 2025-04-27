// server/routes/summonerRoutes.js
const express = require('express');
const router = express.Router();
const summonerController = require('../controllers/summonerController');

router.get('/:region/:name', summonerController.getSummonerData);
router.get('/:region/:summonerId/league', summonerController.getLeagueData);
router.get('/:region/:summonerId/masteries', summonerController.getChampionMasteries);

module.exports = router;