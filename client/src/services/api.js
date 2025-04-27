// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const summonerApi = {
  getSummonerByName: (region, name) => {
    return api.get(`/summoner/${region}/${encodeURIComponent(name)}`);
  },
  getLeagueData: (region, summonerId) => {
    return api.get(`/summoner/${region}/${summonerId}/league`);
  },
  getChampionMasteries: (region, summonerId) => {
    return api.get(`/summoner/${region}/${summonerId}/masteries`);
  }
};

export const matchApi = {
  getRecentMatches: (region, puuid, count = 20) => {
    return api.get(`/matches/${region}/${puuid}/recent?count=${count}`);
  },
  getMatchDetails: (region, matchId) => {
    return api.get(`/matches/${region}/${matchId}`);
  }
};

export const statsApi = {
  getPlayerStats: (region, puuid) => {
    return api.get(`/stats/${region}/${puuid}/overview`);
  },
  getChampionStats: (region, puuid) => {
    return api.get(`/stats/${region}/${puuid}/champions`);
  },
  getImprovementMetrics: (region, puuid) => {
    return api.get(`/stats/${region}/${puuid}/improvement`);
  }
};

export default {
  summoner: summonerApi,
  match: matchApi,
  stats: statsApi
};