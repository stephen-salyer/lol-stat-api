// server/controllers/statsController.js
const riotApiService = require('../services/riotApiService');
const statsAnalysisService = require('../services/statsAnalysisService');

const statsController = {
  getPlayerStats: async (req, res) => {
    try {
      const { region, puuid } = req.params;
      
      // Get recent matches
      const matchIds = await riotApiService.getMatchIdsByPuuid(puuid, region, 20);
      
      // Get details for each match
      const matchPromises = matchIds.map(id => riotApiService.getMatchByMatchId(id, region));
      const matchesData = await Promise.all(matchPromises);
      
      // Calculate stats
      const stats = statsAnalysisService.calculateAverageStats(matchesData, puuid);
      
      res.json(stats);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error calculating player stats'
      });
    }
  },

  getChampionStats: async (req, res) => {
    try {
      const { region, puuid } = req.params;
      
      // This would be implemented with more detailed champion stats
      res.json({ message: "Champion stats feature coming soon" });
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error calculating champion stats'
      });
    }
  },

  getImprovementMetrics: async (req, res) => {
    try {
      const { region, puuid } = req.params;
      
      // Get recent matches (last 10)
      const recentMatchIds = await riotApiService.getMatchIdsByPuuid(puuid, region, 10);
      
      // Get older matches (11-20)
      const olderMatchIds = await riotApiService.getMatchIdsByPuuid(puuid, region, 10, 10);
      
      // Get details for all matches
      const recentMatchPromises = recentMatchIds.map(id => riotApiService.getMatchByMatchId(id, region));
      const olderMatchPromises = olderMatchIds.map(id => riotApiService.getMatchByMatchId(id, region));
      
      const recentMatches = await Promise.all(recentMatchPromises);
      const olderMatches = await Promise.all(olderMatchPromises);
      
      // Calculate improvement metrics
      const improvementMetrics = statsAnalysisService.getPlayerImprovementMetrics(olderMatches, recentMatches, puuid);
      
      res.json(improvementMetrics);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error calculating improvement metrics'
      });
    }
  }
};

module.exports = statsController;