// server/config/config.js
require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  riotApiKey: process.env.RIOT_API_KEY,
  environment: process.env.NODE_ENV || 'development'
};

module.exports = config;