// server/controllers/summonerController.js
const riotApiService = require('../services/riotApiService');

const summonerController = {
  getSummonerData: async (req, res) => {
    try {
      const { region, name } = req.params;
      const summonerData = await riotApiService.getSummonerByName(name, region);
      res.json(summonerData);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error fetching summoner data'
      });
    }
  },

  getLeagueData: async (req, res) => {
    try {
      const { region, summonerId } = req.params;
      const leagueData = await riotApiService.getLeagueEntriesBySummonerId(summonerId, region);
      res.json(leagueData);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error fetching league data'
      });
    }
  },

  getChampionMasteries: async (req, res) => {
    try {
      const { region, summonerId } = req.params;
      const masteryData = await riotApiService.getChampionMasteryBySummonerId(summonerId, region);
      res.json(masteryData);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.status?.message || 'Error fetching mastery data'
      });
    }
  }
};

module.exports = summonerController;