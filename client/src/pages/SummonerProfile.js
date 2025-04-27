// client/src/pages/SummonerProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Avatar, 
  Divider, 
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { summonerApi, statsApi } from '../services/api';
import StatsOverviewCard from '../components/StatsOverviewCard';
import RecentMatchesList from '../components/RecentMatchesList';

function SummonerProfile() {
  const { region, name } = useParams();
  const [summoner, setSummoner] = useState(null);
  const [leagueData, setLeagueData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummonerData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch summoner data
        const summonerRes = await summonerApi.getSummonerByName(region, name);
        const summonerData = summonerRes.data;
        setSummoner(summonerData);
        
        // Fetch league data
        const leagueRes = await summonerApi.getLeagueData(region, summonerData.id);
        setLeagueData(leagueRes.data);
        
        // Fetch player stats
        const statsRes = await statsApi.getPlayerStats(region, summonerData.puuid);
        setStats(statsRes.data);
        
      } catch (err) {
        console.error('Error fetching summoner data:', err);
        setError('Failed to load summoner data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummonerData();
  }, [region, name]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h5" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
          <Button 
            component={RouterLink} 
            to="/" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!summoner) return null;

  // Find solo queue data if available
  const soloQueue = leagueData.find(queue => queue.queueType === 'RANKED_SOLO_5x5');
  const flexQueue = leagueData.find(queue => queue.queueType === 'RANKED_FLEX_SR');

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                alt={summoner.name}
                src={`http://ddragon.leagueoflegends.com/cdn/12.8.1/img/profileicon/${summoner.profileIconId}.png`}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h4" component="h1">
                {summoner.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Level {summoner.summonerLevel}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Chip 
                  label={`Region: ${region.toUpperCase()}`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Ranked Info
            </Typography>
            <Grid container spacing={2}>
              {soloQueue ? (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        Solo/Duo Queue
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Avatar 
                          alt={soloQueue.tier} 
                          src={`/assets/ranked-emblems/${soloQueue.tier.toLowerCase()}.png`} 
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {`${soloQueue.tier} ${soloQueue.rank}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${soloQueue.leaguePoints} LP`}
                          </Typography>
                          <Typography variant="body2">
                            {`${soloQueue.wins}W ${soloQueue.losses}L (${Math.round((soloQueue.wins / (soloQueue.wins + soloQueue.losses)) * 100)}%)`}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        Solo/Duo Queue
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Unranked
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              {flexQueue ? (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        Flex Queue
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Avatar 
                          alt={flexQueue.tier} 
                          src={`/assets/ranked-emblems/${flexQueue.tier.toLowerCase()}.png`} 
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {`${flexQueue.tier} ${flexQueue.rank}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${flexQueue.leaguePoints} LP`}
                          </Typography>
                          <Typography variant="body2">
                            {`${flexQueue.wins}W ${flexQueue.losses}L (${Math.round((flexQueue.wins / (flexQueue.wins + flexQueue.losses)) * 100)}%)`}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        Flex Queue
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Unranked
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
            
            {stats && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Performance Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <StatsOverviewCard 
                      title="KDA Ratio" 
                      value={stats.averageKDA} 
                      icon={<EmojiEventsIcon />} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatsOverviewCard 
                      title="Win Rate" 
                      value={`${stats.winRate}%`} 
                      icon={<InsightsIcon />} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatsOverviewCard 
                      title="CS/Min" 
                      value={stats.averageCSPerMinute} 
                      icon={<HistoryIcon />} 
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button 
                component={RouterLink}
                to={`/summoner/${region}/${name}/matches`}
                variant="contained" 
                color="primary"
                fullWidth
              >
                Match History
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                component={RouterLink}
                to={`/summoner/${region}/${name}/champions`}
                variant="contained" 
                color="secondary"
                fullWidth
              >
                Champion Stats
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                component={RouterLink}
                to={`/summoner/${region}/${name}/improvement`}
                variant="contained" 
                color="info"
                fullWidth
              >
                Improvement Dashboard
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <RecentMatchesList region={region} puuid={summoner.puuid} limit={5} />
    </Container>
  );
}

export default SummonerProfile;