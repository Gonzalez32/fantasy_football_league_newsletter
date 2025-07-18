const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Yahoo Fantasy API configuration
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const YAHOO_REDIRECT_URI = 'http://localhost:5001/auth/callback';

// Store tokens (in production, use a database)
let accessToken = null;
let refreshToken = null;

// Helper to parse XML to JSON
const parseXml = async (xml) => {
  return await xml2js.parseStringPromise(xml, { explicitArray: false });
};

// Routes

// 1. Initiate OAuth flow
app.get('/auth/yahoo', (req, res) => {
  const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${YAHOO_CLIENT_ID}&redirect_uri=${YAHOO_REDIRECT_URI}&response_type=code&scope=fspt-r`;
  res.json({ authUrl });
});

// 2. Handle OAuth callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not received' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.login.yahoo.com/oauth2/get_token', {
      client_id: YAHOO_CLIENT_ID,
      client_secret: YAHOO_CLIENT_SECRET,
      redirect_uri: YAHOO_REDIRECT_URI,
      code: code,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    accessToken = tokenResponse.data.access_token;
    refreshToken = tokenResponse.data.refresh_token;

    res.json({ 
      success: true, 
      message: 'Authentication successful! You can now close this window.' 
    });
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange authorization code' });
  }
});

// 3. Get league information
app.get('/api/league/:leagueId', async (req, res) => {
  const { leagueId } = req.params;
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated. Please authenticate first.' });
  }

  try {
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${leagueId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        responseType: 'text',
      }
    );
    const json = await parseXml(response.data);
    res.json(json);
  } catch (error) {
    console.error('League API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch league data' });
  }
});

// 4. Get team information
app.get('/api/team/:teamKey', async (req, res) => {
  const { teamKey } = req.params;
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated. Please authenticate first.' });
  }

  try {
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Team API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

// 5. Get player information
app.get('/api/players/:playerKeys', async (req, res) => {
  const { playerKeys } = req.params;
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated. Please authenticate first.' });
  }

  try {
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=${playerKeys}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        responseType: 'text',
      }
    );
    const json = await parseXml(response.data);
    res.json(json);
  } catch (error) {
    console.error('Player API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

// 6. Get league standings
app.get('/api/standings/:leagueId', async (req, res) => {
  const { leagueId } = req.params;
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated. Please authenticate first.' });
  }

  try {
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${leagueId}/standings`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        responseType: 'text',
      }
    );
    const json = await parseXml(response.data);
    res.json(json);
  } catch (error) {
    console.error('Standings API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch standings data' });
  }
});

// 7. Check authentication status
app.get('/api/auth/status', (req, res) => {
  res.json({ 
    authenticated: !!accessToken,
    hasToken: !!accessToken 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Yahoo Fantasy API server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Auth URL: http://localhost:${PORT}/auth/yahoo`);
}); 