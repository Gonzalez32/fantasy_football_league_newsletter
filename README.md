# Fantasy Football League Newsletter

A React-based newsletter application for fantasy football leagues, featuring real-time data integration with Yahoo Fantasy Sports API.

## Features

- 🏈 **Real-time Fantasy Data**: Integration with Yahoo Fantasy Sports API
- 📊 **League Statistics**: Standings, player stats, and team information
- 🎨 **Modern UI**: Built with React, TypeScript, and Bulma CSS framework
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔐 **Secure Authentication**: OAuth 2.0 integration with Yahoo

## Tech Stack

- **Frontend**: React 18, TypeScript, Bulma CSS
- **Backend**: Node.js, Express.js
- **API**: Yahoo Fantasy Sports API
- **HTTP Client**: Axios

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Yahoo Fantasy Sports account
- Yahoo Developer App credentials

### 1. Yahoo Developer App Setup

1. Go to [Yahoo Developer Network](https://developer.yahoo.com/apps/)
2. Sign in with your Yahoo account
3. Create a new app:
   - **App Name**: "Fantasy Football League Newsletter"
   - **Description**: "Newsletter app for fantasy football league updates"
   - **Homepage URL**: `http://localhost:3000`
   - **Callback Domain**: `localhost`
4. Note down your **Client ID** and **Client Secret**

### 2. Environment Configuration

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Yahoo credentials:
   ```env
   YAHOO_CLIENT_ID=your_client_id_here
   YAHOO_CLIENT_SECRET=your_client_secret_here
   PORT=5000
   ```

### 3. Install Dependencies

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

### 4. Start the Application

1. Start the backend server (from the server directory):
   ```bash
   cd server
   npm start
   ```

2. Start the React development server (from the root directory):
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

### 5. Authentication

1. Click "Connect to Yahoo" in the app
2. Complete the OAuth flow in the popup window
3. Return to the main app to see your league data

## Project Structure

```
fantasy_football_league_newsletter/
├── public/                 # Static assets
├── src/                    # React source code
│   ├── components/         # React components
│   │   └── YahooAuth.tsx  # Yahoo authentication component
│   ├── services/           # API services
│   │   └── yahooApi.ts    # Yahoo API service
│   ├── App.tsx            # Main app component
│   └── index.css          # Global styles with Bulma
├── server/                 # Backend server
│   ├── index.js           # Express server
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
└── package.json           # Frontend dependencies
```

## API Endpoints

### Backend Server (Port 5000)

- `GET /api/health` - Health check
- `GET /api/auth/status` - Check authentication status
- `GET /auth/yahoo` - Get Yahoo OAuth URL
- `GET /auth/callback` - OAuth callback handler
- `GET /api/league/:leagueId` - Get league information
- `GET /api/standings/:leagueId` - Get league standings
- `GET /api/team/:teamKey` - Get team information
- `GET /api/players/:playerKeys` - Get player information

## League Information

- **League Name**: Carrots Inglorious League 25
- **League ID**: 223443
- **Platform**: Yahoo Fantasy Sports

## Development

### Available Scripts

**Frontend (React):**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

**Backend (Express):**
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-restart)

### Adding New Features

1. **New API Endpoints**: Add routes in `server/index.js`
2. **New Components**: Create in `src/components/`
3. **New Services**: Add to `src/services/`
4. **Styling**: Use Bulma classes or add custom CSS

## Troubleshooting

### Common Issues

1. **Authentication Fails**
   - Ensure your Yahoo Developer App is properly configured
   - Check that callback URLs match exactly
   - Verify Client ID and Secret are correct

2. **CORS Errors**
   - Backend server must be running on port 5000
   - Frontend must be running on port 3000

3. **API Rate Limits**
   - Yahoo API has rate limits
   - Implement caching for production use

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **Yahoo API**: Check [Yahoo Developer Documentation](https://developer.yahoo.com/fantasysports/)
- **React/TypeScript**: Check [React Documentation](https://reactjs.org/)
- **Bulma CSS**: Check [Bulma Documentation](https://bulma.io/) 