// server/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/:region/:puuid/overview', statsController.getPlayerStats);
router.get('/:region/:puuid/champions', statsController.getChampionStats);
router.get('/:region/:puuid/improvement', statsController.getImprovementMetrics);

module.exports = router;