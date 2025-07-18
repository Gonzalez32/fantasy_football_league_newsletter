import React, { useEffect, useState } from 'react';
import yahooApiService from '../services/yahooApi';

const LEAGUE_ID = '223443';

const PlayerStatsTable: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        // First, fetch league info to get all player keys
        const leagueData = await yahooApiService.getLeagueInfo(LEAGUE_ID);
        // Yahoo's JSON structure: fantasy_content.league.players.player (array)
        // If not available, fallback to teams and their rosters
        let playerKeys: string[] = [];
        const teams = leagueData?.fantasy_content?.league?.teams?.team || [];
        const teamsArr = Array.isArray(teams) ? teams : [teams];
        teamsArr.forEach((team: any) => {
          const roster = team.roster?.players?.player || [];
          const rosterArr = Array.isArray(roster) ? roster : [roster];
          rosterArr.forEach((player: any) => {
            if (player.player_key) playerKeys.push(player.player_key);
          });
        });
        // Remove duplicates
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
        setPlayers(allPlayers);
      } catch (err) {
        setError('Failed to fetch player stats');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  if (loading) return <div>Loading player stats...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;
  if (!players.length) return <div>No player stats available.</div>;

  return (
    <div className="box">
      <h3 className="title is-4">📊 Player Stats</h3>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>Points</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {players.map((playerObj: any, idx: number) => {
            const player = playerObj.player || playerObj;
            const name = player.name?.full || player.name;
            const team = player.editorial_team_abbr || player.editorial_team_full_name || '';
            const pos = player.display_position || player.eligible_positions?.position || '';
            const points = player.player_points?.total || player.player_stats?.stats?.stat?.find((s: any) => s.stat_id === '4')?.value || '';
            const status = player.status || '';
            return (
              <tr key={player.player_key || idx}>
                <td>{name}</td>
                <td>{team}</td>
                <td>{pos}</td>
                <td>{points}</td>
                <td>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsTable; 