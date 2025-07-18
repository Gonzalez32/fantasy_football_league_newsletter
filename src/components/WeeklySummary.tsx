import React, { useEffect, useState } from 'react';
import yahooApiService from '../services/yahooApi';

const LEAGUE_ID = '223443';

const WeeklySummary: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch league info and standings
        const leagueData = await yahooApiService.getLeagueInfo(LEAGUE_ID);
        const standingsData = await yahooApiService.getStandings(LEAGUE_ID);
        // Get teams and their scores for the week
        const teams =
          standingsData?.fantasy_content?.league?.standings?.teams?.team || [];
        const teamsArr = Array.isArray(teams) ? teams : [teams];
        // Find top team and lowest team by points for
        const sortedTeams = [...teamsArr].sort((a: any, b: any) => {
          const aPoints = parseFloat(a.team_standings?.points_for || a[1]?.team_standings?.points_for || '0');
          const bPoints = parseFloat(b.team_standings?.points_for || b[1]?.team_standings?.points_for || '0');
          return bPoints - aPoints;
        });
        const topTeam = sortedTeams[0];
        const lowTeam = sortedTeams[sortedTeams.length - 1];
        // Get all player keys from all teams
        let playerKeys: string[] = [];
        const leagueTeams = leagueData?.fantasy_content?.league?.teams?.team || [];
        const leagueTeamsArr = Array.isArray(leagueTeams) ? leagueTeams : [leagueTeams];
        leagueTeamsArr.forEach((team: any) => {
          const roster = team.roster?.players?.player || [];
          const rosterArr = Array.isArray(roster) ? roster : [roster];
          rosterArr.forEach((player: any) => {
            if (player.player_key) playerKeys.push(player.player_key);
          });
        });
        playerKeys = Array.from(new Set(playerKeys));
        // Yahoo API only allows up to 25 player keys per request
        const chunkSize = 25;
        let allPlayers: any[] = [];
        for (let i = 0; i < playerKeys.length; i += chunkSize) {
          const chunk = playerKeys.slice(i, i + chunkSize).join(',');
          const data = await yahooApiService.getPlayerInfo(chunk);
          const playersArr =
            data?.fantasy_content?.players?.player || [];
          allPlayers = allPlayers.concat(Array.isArray(playersArr) ? playersArr : [playersArr]);
        }
        // Find top 5 players by points
        const topPlayers = [...allPlayers]
          .map((p: any) => {
            const player = p.player || p;
            const points = parseFloat(player.player_points?.total || player.player_stats?.stats?.stat?.find((s: any) => s.stat_id === '4')?.value || '0');
            return { ...player, points };
          })
          .sort((a, b) => b.points - a.points)
          .slice(0, 5);
        setSummary({
          topTeam,
          lowTeam,
          topPlayers,
        });
      } catch (err) {
        setError('Failed to fetch weekly summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Loading weekly summary...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;
  if (!summary) return <div>No summary available.</div>;

  const getTeamName = (teamObj: any) =>
    teamObj.name || teamObj[1]?.name || 'Unknown';
  const getPoints = (teamObj: any) =>
    teamObj.team_standings?.points_for || teamObj[1]?.team_standings?.points_for || '0';

  return (
    <section className="section">
      <div className="container">
        <div className="box has-background-primary-light">
          <h2 className="title is-3">Weekly Summary</h2>
          <div className="columns">
            <div className="column">
              <h4 className="subtitle is-5">Top Team</h4>
              <p><strong>{getTeamName(summary.topTeam)}</strong></p>
              <p>Points For: <strong>{getPoints(summary.topTeam)}</strong></p>
            </div>
            <div className="column">
              <h4 className="subtitle is-5">Lowest Scoring Team</h4>
              <p><strong>{getTeamName(summary.lowTeam)}</strong></p>
              <p>Points For: <strong>{getPoints(summary.lowTeam)}</strong></p>
            </div>
            <div className="column">
              <h4 className="subtitle is-5">Top Players</h4>
              <ul>
                {summary.topPlayers.map((player: any, idx: number) => (
                  <li key={player.player_key || idx}>
                    <strong>{player.name?.full || player.name}</strong> ({player.display_position || ''}) - {player.points} pts
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklySummary; 