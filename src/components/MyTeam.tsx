import React, { useEffect, useState } from 'react';
import yahooApiService from '../services/yahooApi';

const LEAGUE_ID = '223443';

const MyTeam: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeamKey, setSelectedTeamKey] = useState<string>('');
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const leagueData = await yahooApiService.getLeagueInfo(LEAGUE_ID);
        const teamsArr = leagueData?.fantasy_content?.league?.teams?.team || [];
        setTeams(Array.isArray(teamsArr) ? teamsArr : [teamsArr]);
      } catch (err) {
        setError('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchRoster = async () => {
      if (!selectedTeamKey) return;
      setLoading(true);
      setError(null);
      try {
        const teamData = await yahooApiService.getTeamInfo(selectedTeamKey);
        const team = teamData?.fantasy_content?.team || teamData?.fantasy_content?.teams?.team;
        const playersArr = team?.roster?.players?.player || [];
        setRoster(Array.isArray(playersArr) ? playersArr : [playersArr]);
      } catch (err) {
        setError('Failed to fetch roster');
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [selectedTeamKey]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamKey(e.target.value);
  };

  const getRowClass = (status: string) => {
    if (status === 'INJ') return 'has-background-danger-light';
    if (status === 'BN') return 'has-background-warning-light';
    return '';
  };

  return (
    <div className="box">
      <h3 className="title is-4">My Team</h3>
      {error && <div className="notification is-danger">{error}</div>}
      <div className="field">
        <label className="label">Select Your Team</label>
        <div className="control">
          <div className="select">
            <select value={selectedTeamKey} onChange={handleSelect}>
              <option value="">-- Choose a team --</option>
              {teams.map((teamObj: any, idx: number) => {
                const team = teamObj.team_key ? teamObj : teamObj[1];
                return (
                  <option key={team.team_key} value={team.team_key}>
                    {team.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      {loading && <div>Loading roster...</div>}
      {roster.length > 0 && (
        <table className="table is-striped is-fullwidth mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((playerObj: any, idx: number) => {
              const player = playerObj.player || playerObj;
              const name = player.name?.full || player.name;
              const pos = player.display_position || player.eligible_positions?.position || '';
              const status = player.status || '';
              const points = player.player_points?.total || player.player_stats?.stats?.stat?.find((s: any) => s.stat_id === '4')?.value || '';
              return (
                <tr key={player.player_key || idx} className={getRowClass(status)}>
                  <td>{name}</td>
                  <td>{pos}</td>
                  <td>
                    {status === 'INJ' && <span className="tag is-danger">Injured</span>}
                    {status === 'BN' && <span className="tag is-warning">Benched</span>}
                    {!status && <span>-</span>}
                    {status !== 'INJ' && status !== 'BN' && status && <span>{status}</span>}
                  </td>
                  <td>{points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyTeam; 