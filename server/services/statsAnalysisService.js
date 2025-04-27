// server/services/statsAnalysisService.js
const statsAnalysisService = {
    calculateKDA: (kills, deaths, assists) => {
      return deaths === 0 ? (kills + assists) : ((kills + assists) / deaths).toFixed(2);
    },
  
    calculateWinRate: (matches) => {
      const totalGames = matches.length;
      if (totalGames === 0) return 0;
      
      const wins = matches.filter(match => match.win).length;
      return ((wins / totalGames) * 100).toFixed(2);
    },
  
    calculateCSPerMinute: (totalCS, gameDurationInSeconds) => {
      const gameDurationInMinutes = gameDurationInSeconds / 60;
      return (totalCS / gameDurationInMinutes).toFixed(2);
    },
  
    calculateAverageStats: (matches, puuid) => {
      if (matches.length === 0) return null;
      
      let totalKills = 0;
      let totalDeaths = 0;
      let totalAssists = 0;
      let totalCS = 0;
      let totalVisionScore = 0;
      let totalGoldEarned = 0;
      let totalDamageDealt = 0;
      let wins = 0;
      
      matches.forEach(match => {
        // Find player in match participants
        const participant = match.info.participants.find(p => p.puuid === puuid);
        if (!participant) return;
        
        totalKills += participant.kills;
        totalDeaths += participant.deaths;
        totalAssists += participant.assists;
        totalCS += participant.totalMinionsKilled + (participant.neutralMinionsKilled || 0);
        totalVisionScore += participant.visionScore;
        totalGoldEarned += participant.goldEarned;
        totalDamageDealt += participant.totalDamageDealtToChampions;
        
        if (participant.win) wins++;
      });
      
      const numMatches = matches.length;
      
      return {
        averageKills: (totalKills / numMatches).toFixed(2),
        averageDeaths: (totalDeaths / numMatches).toFixed(2),
        averageAssists: (totalAssists / numMatches).toFixed(2),
        averageKDA: statsAnalysisService.calculateKDA(totalKills, totalDeaths, totalAssists),
        averageCS: (totalCS / numMatches).toFixed(2),
        averageVisionScore: (totalVisionScore / numMatches).toFixed(2),
        averageGoldEarned: (totalGoldEarned / numMatches).toFixed(2),
        averageDamageDealt: (totalDamageDealt / numMatches).toFixed(2),
        winRate: ((wins / numMatches) * 100).toFixed(2)
      };
    },
  
    getPlayerImprovementMetrics: (olderMatches, recentMatches, puuid) => {
      const olderStats = statsAnalysisService.calculateAverageStats(olderMatches, puuid);
      const recentStats = statsAnalysisService.calculateAverageStats(recentMatches, puuid);
      
      if (!olderStats || !recentStats) return null;
      
      return {
        kdaDifference: (recentStats.averageKDA - olderStats.averageKDA).toFixed(2),
        deathDifference: (recentStats.averageDeaths - olderStats.averageDeaths).toFixed(2),
        assistDifference: (recentStats.averageAssists - olderStats.averageAssists).toFixed(2),
        csDifference: (recentStats.averageCS - olderStats.averageCS).toFixed(2),
        visionScoreDifference: (recentStats.averageVisionScore - olderStats.averageVisionScore).toFixed(2),
        winRateDifference: (recentStats.winRate - olderStats.winRate).toFixed(2)
      };
    }
  };
  
  module.exports = statsAnalysisService;