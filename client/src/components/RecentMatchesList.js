// client/src/components/RecentMatchesList.js
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Chip, 
  Divider, 
  Button, 
  CircularProgress 
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { matchApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

function RecentMatchesList({ region, puuid, limit = 5 }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch recent match IDs
        const matchIdsRes = await matchApi.getRecentMatches(region, puuid, limit);
        const matchIds = matchIdsRes.data;
        
        // Fetch match details for each match ID
        const matchDetailsPromises = matchIds.map(matchId => 
          matchApi.getMatchDetails(region, matchId)
        );
        
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        const matchDetails = matchDetailsResponses.map(res => res.data);
        
        setMatches(matchDetails);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load recent matches');
      } finally {
        setLoading(false);
      }
    };
    
    if (puuid) {
      fetchMatches();
    }
  }, [region, puuid, limit]);

  const getPlayerData = (match) => {
    const participant = match.info.participants.find(p => p.puuid === puuid);
    return participant || {};
  };

  const formatGameDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getQueueName = (queueId) => {
    const queues = {
      400: 'Normal Draft',
      420: 'Ranked Solo/Duo',
      430: 'Normal Blind',
      440: 'Ranked Flex',
      450: 'ARAM',
      700: 'Clash',
      // Add more as needed
    };
    
    return queues[queueId] || 'Custom';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Recent Matches
      </Typography>
      
      {matches.length === 0 ? (
        <Typography>No recent matches found</Typography>
      ) : (
        <List>
          {matches.map((match, index) => {
            const playerData = getPlayerData(match);
            const isWin = playerData.win;
            
            return (
              <React.Fragment key={match.metadata.matchId}>
                {index > 0 && <Divider />}
                <ListItem 
                  sx={{ 
                    borderLeft: 6, 
                    borderColor: isWin ? 'success.main' : 'error.main',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={playerData.championName}
                      src={`http://ddragon.leagueoflegends.com/cdn/12.8.1/img/champion/${playerData.championName}.png`}
                      sx={{ width: 60, height: 60, mr: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="span">
                          {playerData.championName}
                        </Typography>
                        <Chip 
                          icon={isWin ? <ThumbUpIcon /> : <ThumbDownIcon />}
                          label={isWin ? 'Victory' : 'Defeat'} 
                          color={isWin ? 'success' : 'error'} 
                          size="small"
                          sx={{ ml: 2 }}
                        />
                        <Chip 
                          label={getQueueName(match.info.queueId)} 
                          variant="outlined"
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" component="span">
                          {`${playerData.kills}/${playerData.deaths}/${playerData.assists}`}
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                          •
                        </Typography>
                        <Typography variant="body2" component="span">
                          {`KDA: ${playerData.challenges?.kda?.toFixed(2) || '-'}`}
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                          •
                        </Typography>
                        <Typography variant="body2" component="span">
                          {`CS: ${playerData.totalMinionsKilled + (playerData.neutralMinionsKilled || 0)}`}
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                          •
                        </Typography>
                        <Typography variant="body2" component="span">
                          {formatGameDuration(match.info.gameDuration)}
                        </Typography>
                      </Box>
                    }
                    sx={{ ml: 2 }}
                  />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(`/summoner/${region}/${encodeURIComponent(puuid)}/matches`)}
        >
          View All Matches
        </Button>
      </Box>
    </Paper>
  );
}

export default RecentMatchesList;