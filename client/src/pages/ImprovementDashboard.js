// client/src/pages/ImprovementDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningIcon from '@mui/icons-material/Warning';
import { summonerApi, statsApi } from '../services/api';

function ImprovementDashboard() {
  const { region, name } = useParams();
  const [summoner, setSummoner] = useState(null);
  const [improvementData, setImprovementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch summoner data
        const summonerRes = await summonerApi.getSummonerByName(region, name);
        const summonerData = summonerRes.data;
        setSummoner(summonerData);
        
        // Fetch improvement metrics
        const improvementRes = await statsApi.getImprovementMetrics(region, summonerData.puuid);
        setImprovementData(improvementRes.data);
        
      } catch (err) {
        console.error('Error fetching improvement data:', err);
        setError('Failed to load improvement data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [region, name]);

  const generateRecommendations = (data) => {
    if (!data) return [];
    
    const recommendations = [];
    
    // KDA recommendations
    if (parseFloat(data.kdaDifference) < 0) {
      recommendations.push({
        area: 'KDA',
        message: 'Your KDA has decreased recently. Focus on positioning and map awareness to reduce deaths.',
        icon: <WarningIcon color="error" />
      });
    }
    
    // CS recommendations
    if (parseFloat(data.csDifference) < 0) {
      recommendations.push({
        area: 'CS',
        message: 'Your CS per minute has decreased. Practice last hitting and managing waves.',
        icon: <WarningIcon color="error" />
      });
    } else if (parseFloat(data.csDifference) > 0) {
      recommendations.push({
        area: 'CS',
        message: 'Great improvement in CS! Keep it up and try to maintain consistent farm throughout the game.',
        icon: <EmojiEventsIcon color="success" />
      });
    }
    
    // Vision recommendations
    if (parseFloat(data.visionScoreDifference) < 0) {
      recommendations.push({
        area: 'Vision',
        message: 'Your vision control has decreased. Place more wards and buy control wards regularly.',
        icon: <WarningIcon color="error" />
      });
    }
    
    // Win rate recommendations
    if (parseFloat(data.winRateDifference) < -5) {
      recommendations.push({
        area: 'Win Rate',
        message: 'Your win rate has significantly decreased. Consider focusing on a smaller champion pool.',
        icon: <WarningIcon color="error" />
      });
    } else if (parseFloat(data.winRateDifference) > 5) {
      recommendations.push({
        area: 'Win Rate',
        message: 'Impressive win rate improvement! Focus on whats working and continue to refine your gameplay.',
        icon: <EmojiEventsIcon color="success" />
      });
    }
    
    // General recommendations
    recommendations.push({
      area: 'General',
      message: 'Review your replays to identify patterns in your gameplay that could be improved.',
      icon: <LightbulbIcon color="info" />
    });
    
    recommendations.push({
      area: 'General',
      message: 'Try to focus on 2-3 champions in your main role to improve consistency.',
      icon: <LightbulbIcon color="info" />
    });
    
    return recommendations;
  };

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
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!summoner || !improvementData) return null;

  const recommendations = generateRecommendations(improvementData);

  // Helper function to safely parse and format numbers
  const formatValue = (value, includeSign = true, suffix = '') => {
    const numValue = parseFloat(value) || 0;
    return `${includeSign && numValue > 0 ? '+' : ''}${numValue.toFixed(2)}${suffix}`;
  };

  // Helper function to calculate progress bar value safely
  const calculateProgressValue = (value, multiplier = 10) => {
    const numValue = parseFloat(value) || 0;
    const result = 50 + (numValue * multiplier);
    // Ensure value is between 0 and 100
    return Math.min(Math.max(result, 0), 100);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {`${summoner.name}'s Improvement Dashboard`}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Compare your recent performance to identify areas for improvement
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Performance Trends
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      KDA Ratio
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {parseFloat(improvementData.kdaDifference || 0) > 0 ? (
                        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        {formatValue(improvementData.kdaDifference)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgressValue(improvementData.kdaDifference, 10)}
                      color={parseFloat(improvementData.kdaDifference || 0) > 0 ? "success" : "error"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Win Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {parseFloat(improvementData.winRateDifference || 0) > 0 ? (
                        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        {formatValue(improvementData.winRateDifference, true, '%')}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgressValue(improvementData.winRateDifference, 2)}
                      color={parseFloat(improvementData.winRateDifference || 0) > 0 ? "success" : "error"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      CS Per Minute
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {parseFloat(improvementData.csDifference || 0) > 0 ? (
                        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        {formatValue(improvementData.csDifference)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgressValue(improvementData.csDifference, 10)}
                      color={parseFloat(improvementData.csDifference || 0) > 0 ? "success" : "error"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Vision Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {parseFloat(improvementData.visionScoreDifference || 0) > 0 ? (
                        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        {formatValue(improvementData.visionScoreDifference)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgressValue(improvementData.visionScoreDifference, 5)}
                      color={parseFloat(improvementData.visionScoreDifference || 0) > 0 ? "success" : "error"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recommendations
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              {recommendations.map((rec, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemIcon>
                    {rec.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1">{rec.area}</Typography>}
                    secondary={rec.message}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ImprovementDashboard;