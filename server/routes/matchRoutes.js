// server/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/:region/:puuid/recent', matchController.getRecentMatches);
router.get('/:region/:matchId', matchController.getMatchDetails);

module.exports = router;