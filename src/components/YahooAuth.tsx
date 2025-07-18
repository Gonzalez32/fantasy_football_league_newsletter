import React, { useState, useEffect } from 'react';
import yahooApiService from '../services/yahooApi';

interface AuthStatus {
  authenticated: boolean;
  hasToken: boolean;
}

interface LeagueData {
  fantasy_content?: {
    league?: Array<{
      league?: Array<{
        name?: string;
        league_key?: string;
        num_teams?: number;
        season?: string;
      }>;
    }>;
  };
}

const YahooAuth: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false, hasToken: false });
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Your league ID from Yahoo
  const LEAGUE_ID = '223443'; // Carrots Inglorious League 25

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await yahooApiService.checkAuthStatus();
      setAuthStatus(status);
      
      if (status.authenticated) {
        fetchLeagueData();
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };

  const handleAuthenticate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authUrl = await yahooApiService.getAuthUrl();
      window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Poll for authentication status
      const pollAuth = setInterval(async () => {
        const status = await yahooApiService.checkAuthStatus();
        if (status.authenticated) {
          setAuthStatus(status);
          fetchLeagueData();
          clearInterval(pollAuth);
          setLoading(false);
        }
      }, 2000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollAuth);
        setLoading(false);
      }, 300000);
      
    } catch (error) {
      setError('Failed to start authentication process');
      setLoading(false);
    }
  };

  const fetchLeagueData = async () => {
    try {
      setLoading(true);
      const data = await yahooApiService.getLeagueInfo(LEAGUE_ID);
      setLeagueData(data);
    } catch (error) {
      setError('Failed to fetch league data');
      console.error('League data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeagueInfo = () => {
    if (!leagueData?.fantasy_content?.league?.[0]?.league?.[0]) {
      return <p>No league data available</p>;
    }

    const league = leagueData.fantasy_content.league[0].league[0];
    
    return (
      <div className="box">
        <h3 className="title is-4">🏈 League Information</h3>
        <div className="content">
          <p><strong>League Name:</strong> {league.name}</p>
          <p><strong>League Key:</strong> {league.league_key}</p>
          <p><strong>Number of Teams:</strong> {league.num_teams}</p>
          <p><strong>Season:</strong> {league.season}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="section">
        <h2 className="title is-3">Yahoo Fantasy API Integration</h2>
        
        {error && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setError(null)}></button>
            {error}
          </div>
        )}

        {!authStatus.authenticated ? (
          <div className="box">
            <h3 className="title is-4">🔐 Yahoo Authentication Required</h3>
            <p>To access your fantasy football league data, you need to authenticate with Yahoo.</p>
            <button 
              className={`button is-primary ${loading ? 'is-loading' : ''}`}
              onClick={handleAuthenticate}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Connect to Yahoo'}
            </button>
            <p className="help mt-2">
              This will open a new window for Yahoo authentication. After completing the process, 
              you can close that window and return here.
            </p>
          </div>
        ) : (
          <div>
            <div className="notification is-success">
              <button className="delete" onClick={() => setAuthStatus({ authenticated: false, hasToken: false })}></button>
              ✅ Successfully authenticated with Yahoo!
            </div>
            
            {loading ? (
              <div className="box">
                <div className="content">
                  <p>Loading league data...</p>
                </div>
              </div>
            ) : (
              renderLeagueInfo()
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YahooAuth; 