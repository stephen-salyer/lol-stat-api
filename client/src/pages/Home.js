// client/src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Paper,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const regions = [
  { value: 'na', label: 'North America' },
  { value: 'euw', label: 'EU West' },
  { value: 'eune', label: 'EU Nordic & East' },
  { value: 'kr', label: 'Korea' },
  { value: 'br', label: 'Brazil' },
  // Add more regions as needed
];

function Home() {
  const [summonerName, setSummonerName] = useState('');
  const [region, setRegion] = useState('na');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!summonerName.trim()) {
      setError('Please enter a summoner name');
      return;
    }
    
    setError('');
    navigate(`/summoner/${region}/${encodeURIComponent(summonerName)}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          LoL Stats Analyzer
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Track your performance and improve your gameplay
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: 'rgba(10, 20, 40, 0.8)' }}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="region-select-label">Region</InputLabel>
                  <Select
                    labelId="region-select-label"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    label="Region"
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.value} value={region.value}>
                        {region.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Summoner Name"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{ height: '56px' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Match History Analysis
                </Typography>
                <Typography variant="body1">
                  Deep dive into your recent matches to find patterns and areas for improvement
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Champion Performance
                </Typography>
                <Typography variant="body1">
                  Get detailed stats on your champion pool and compare with higher-ranked players
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Improvement Tracking
                </Typography>
                <Typography variant="body1">
                  Track your progress over time and get tailored recommendations to climb the ranks
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;