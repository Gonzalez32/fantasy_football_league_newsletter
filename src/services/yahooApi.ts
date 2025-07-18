import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const yahooApiService = {
  // Check authentication status
  checkAuthStatus: async () => {
    try {
      const response = await apiClient.get('/auth/status');
      return response.data;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return { authenticated: false, hasToken: false };
    }
  },

  // Get authentication URL
  getAuthUrl: async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/yahoo');
      return (response.data as any).authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      throw error;
    }
  },

  // Get league information
  getLeagueInfo: async (leagueId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/league/${leagueId}`);
      return response.data as any;
    } catch (error) {
      console.error('Failed to fetch league info:', error);
      throw error;
    }
  },

  // Get league standings
  getStandings: async (leagueId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/standings/${leagueId}`);
      return response.data as any;
    } catch (error) {
      console.error('Failed to fetch standings:', error);
      throw error;
    }
  },

  // Get team information
  getTeamInfo: async (teamKey: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/team/${teamKey}`);
      return response.data as any;
    } catch (error) {
      console.error('Failed to fetch team info:', error);
      throw error;
    }
  },

  // Get player information
  getPlayerInfo: async (playerKeys: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/players/${playerKeys}`);
      return response.data as any;
    } catch (error) {
      console.error('Failed to fetch player info:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/health');
      return response.data as any;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default yahooApiService; 