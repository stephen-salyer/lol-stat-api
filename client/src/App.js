// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Home from './pages/Home';
import SummonerProfile from './pages/SummonerProfile';
import MatchHistory from './pages/MatchHistory';
import ChampionStats from './pages/ChampionStats';
import ImprovementDashboard from './pages/ImprovementDashboard';
import NotFound from './pages/NotFound';

// Create a dark theme with League of Legends color palette
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A96AA', // League of Legends blue
    },
    secondary: {
      main: '#C89B3C', // League of Legends gold
    },
    background: {
      default: '#091428',
      paper: '#0A1428',
    },
  },
  typography: {
    fontFamily: '"Beaufort for LOL", "Spiegel", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/summoner/:region/:name" element={<SummonerProfile />} />
          <Route path="/summoner/:region/:name/matches" element={<MatchHistory />} />
          <Route path="/summoner/:region/:name/champions" element={<ChampionStats />} />
          <Route path="/summoner/:region/:name/improvement" element={<ImprovementDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;