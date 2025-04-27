// server/controllers/matchController.js
const riotApiService = require('../services/riotApiService');

const matchController = {
  getRecentMatches: async (req, res) => {
    try {
      const { region, puuid } = req.params;
      const count = req.query.count || 10;
      
      const matchIds = await riotApiService.getMatchIdsByPuuid(puuid, region, count);
      res.json(matchIds);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error fetching match IDs'
      });
    }
  },

  getMatchDetails: async (req, res) => {
    try {
      const { region, matchId } = req.params;
      const matchData = await riotApiService.getMatchByMatchId(matchId, region);
      res.json(matchData);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error fetching match details'
      });
    }
  }
};

module.exports = matchController;