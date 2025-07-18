import React from 'react';
import './App.css';
import YahooAuth from './components/YahooAuth';
import StandingsTable from './components/StandingsTable';
import PlayerStatsTable from './components/PlayerStatsTable';
import WeeklySummary from './components/WeeklySummary';
import MyTeam from './components/MyTeam';

function App() {
  return (
    <div className="App">
      <WeeklySummary />
      {/* Hero Section */}
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-1">
              🏈 Fantasy Football League Newsletter
            </h1>
            <h2 className="subtitle">
              Your weekly source for fantasy football insights, stats, and updates
            </h2>
          </div>
        </div>
      </section>

      {/* Yahoo API Integration Section */}
      <YahooAuth />
      <MyTeam />
      <StandingsTable />
      <PlayerStatsTable />

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {/* Left Column - Featured News */}
            <div className="column is-8">
              <div className="box">
                <h3 className="title is-4">📊 This Week's Top Performers</h3>
                <div className="content">
                  <p>Stay tuned for the latest player statistics and performance updates...</p>
                  <div className="tags">
                    <span className="tag is-info">QB</span>
                    <span className="tag is-success">RB</span>
                    <span className="tag is-warning">WR</span>
                    <span className="tag is-danger">TE</span>
                  </div>
                </div>
              </div>

              <div className="box">
                <h3 className="title is-4">🏆 League Standings</h3>
                <div className="content">
                  <p>Current league rankings and playoff race updates...</p>
                  <button className="button is-primary">View Full Standings</button>
                </div>
              </div>

              <div className="box">
                <h3 className="title is-4">🔄 Waiver Wire Watch</h3>
                <div className="content">
                  <p>Top available players this week:</p>
                  <ul>
                    <li>Player A - RB - 15.2 pts last week</li>
                    <li>Player B - WR - 12.8 pts last week</li>
                    <li>Player C - QB - 18.5 pts last week</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Quick Stats */}
            <div className="column is-4">
              <div className="box">
                <h3 className="title is-5">⚡ Quick Stats</h3>
                <div className="content">
                  <div className="notification is-info is-light">
                    <strong>Highest Scorer:</strong> Team Alpha - 145.2 pts
                  </div>
                  <div className="notification is-success is-light">
                    <strong>Most Improved:</strong> Team Beta +23.4 pts
                  </div>
                  <div className="notification is-warning is-light">
                    <strong>Waiver Pickups:</strong> 12 this week
                  </div>
                </div>
              </div>

              <div className="box">
                <h3 className="title is-5">📅 Upcoming</h3>
                <div className="content">
                  <ul>
                    <li>Trade Deadline: Week 10</li>
                    <li>Playoffs: Week 14-16</li>
                    <li>Championship: Week 17</li>
                  </ul>
                </div>
              </div>

              <div className="box">
                <h3 className="title is-5">🏥 Injury Report</h3>
                <div className="content">
                  <div className="notification is-danger is-light">
                    <strong>Out:</strong> Player X (RB) - Ankle
                  </div>
                  <div className="notification is-warning is-light">
                    <strong>Questionable:</strong> Player Y (WR) - Hamstring
                  </div>
                  <div className="notification is-success is-light">
                    <strong>Probable:</strong> Player Z (QB) - Shoulder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Fantasy Football League Newsletter</strong> - Built with React, Bulma, and Yahoo Fantasy API
          </p>
          <p className="is-size-7">
            League: Carrots Inglorious League 25 (ID# 223443)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App; 