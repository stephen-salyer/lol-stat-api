// server/services/riotApiService.js
const axios = require('axios');
const config = require('../config/config');

// Base URLs for different Riot API endpoints
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const REGION_PLATFORM_MAPPING = {
  'na': 'na1',
  'euw': 'euw1',
  'eune': 'eun1',
  'kr': 'kr',
  // Add more regions as needed
};

const REGION_ROUTING_MAPPING = {
  'na': 'americas',
  'euw': 'europe',
  'eune': 'europe',
  'kr': 'asia',
  // Add more regions as needed
};

// Create API URLs based on region
function getPlatformUrl(region) {
  const platform = REGION_PLATFORM_MAPPING[region] || 'na1';
  return `https://${platform}.api.riotgames.com/lol`;
}

function getRoutingUrl(region) {
  const routing = REGION_ROUTING_MAPPING[region] || 'americas';
  return `https://${routing}.api.riotgames.com/lol`;
}

// Headers for Riot API requests
const headers = {
  'X-Riot-Token': RIOT_API_KEY
};

// API Services
const riotApiService = {
  // Get summoner data by name
  getSummonerByName: async (summonerName, region = 'na') => {
    try {
      const url = `${getPlatformUrl(region)}/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching summoner data:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get match IDs by PUUID
  getMatchIdsByPuuid: async (puuid, region = 'na', count = 20, queue = null) => {
    try {
      let url = `${getRoutingUrl(region)}/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
      if (queue) url += `&queue=${queue}`;
      
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching match IDs:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get match details by match ID
  getMatchByMatchId: async (matchId, region = 'na') => {
    try {
      const url = `${getRoutingUrl(region)}/match/v5/matches/${matchId}`;
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching match details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get match timeline by match ID
  getMatchTimelineByMatchId: async (matchId, region = 'na') => {
    try {
      const url = `${getRoutingUrl(region)}/match/v5/matches/${matchId}/timeline`;
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching match timeline:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get league entries by summoner ID
  getLeagueEntriesBySummonerId: async (summonerId, region = 'na') => {
    try {
      const url = `${getPlatformUrl(region)}/league/v4/entries/by-summoner/${summonerId}`;
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching league entries:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get champion mastery by summoner ID
  getChampionMasteryBySummonerId: async (summonerId, region = 'na') => {
    try {
      const url = `${getPlatformUrl(region)}/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`;
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching champion mastery:', error.response?.data || error.message);
      throw error;
    }
  }
};

module.exports = riotApiService;