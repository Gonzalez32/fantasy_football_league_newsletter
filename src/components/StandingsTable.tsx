import React, { useEffect, useState } from 'react';
import yahooApiService from '../services/yahooApi';

const LEAGUE_ID = '223443';
const PLAYOFF_SPOTS = 4; // Highlight top 4 teams as playoff spots

const columns = [
  { key: 'rank', label: 'Rank' },
  { key: 'logo', label: '' },
  { key: 'teamName', label: 'Team Name' },
  { key: 'wins', label: 'Wins' },
  { key: 'losses', label: 'Losses' },
  { key: 'ties', label: 'Ties' },
  { key: 'pointsFor', label: 'Points For' },
  { key: 'pointsAgainst', label: 'Points Against' },
];

const StandingsTable: React.FC = () => {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await yahooApiService.getStandings(LEAGUE_ID);
        const teams =
          data?.fantasy_content?.league?.standings?.teams?.team || [];
        setStandings(Array.isArray(teams) ? teams : [teams]);
      } catch (err) {
        setError('Failed to fetch standings');
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const getTeamData = (teamObj: any) => {
    const team = teamObj.team_stats ? teamObj : teamObj[0];
    const teamName = team.name || team[1]?.name;
    const teamStandings = team.team_standings || team[1]?.team_standings;
    const logo = team.team_logos?.team_logo?.url || team[1]?.team_logos?.team_logo?.url || null;
    return {
      rank: parseInt(teamStandings?.rank || '0', 10),
      teamName,
      wins: parseInt(teamStandings?.outcome_totals?.wins || '0', 10),
      losses: parseInt(teamStandings?.outcome_totals?.losses || '0', 10),
      ties: parseInt(teamStandings?.outcome_totals?.ties || '0', 10),
      pointsFor: parseFloat(teamStandings?.points_for || '0'),
      pointsAgainst: parseFloat(teamStandings?.points_against || '0'),
      logo,
      teamId: team.team_id || team[0]?.team_id,
    };
  };

  const numericKeys = ['rank', 'wins', 'losses', 'ties', 'pointsFor', 'pointsAgainst'] as const;
  type NumericKey = typeof numericKeys[number];

  const sortedStandings = [...standings]
    .map(getTeamData)
    .sort((a, b) => {
      if (sortBy === 'teamName') {
        return sortDir === 'asc'
          ? a.teamName.localeCompare(b.teamName)
          : b.teamName.localeCompare(a.teamName);
      }
      if (numericKeys.includes(sortBy as NumericKey)) {
        const key = sortBy as NumericKey;
        return sortDir === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key];
      }
      return 0;
    });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  if (loading) return <div>Loading standings...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;
  if (!standings.length) return <div>No standings data available.</div>;

  return (
    <div className="box">
      <h3 className="title is-4">🏆 League Standings</h3>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ cursor: col.key !== 'logo' ? 'pointer' : undefined }}
                onClick={col.key !== 'logo' ? () => handleSort(col.key) : undefined}
              >
                {col.label}
                {sortBy === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((team, idx) => (
            <tr
              key={team.teamId || idx}
              className={idx < PLAYOFF_SPOTS ? 'has-background-success-light' : ''}
            >
              <td>{team.rank}</td>
              <td>
                {team.logo ? (
                  <img src={team.logo} alt="logo" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                ) : (
                  <span className="tag is-light">{team.teamName?.[0]}</span>
                )}
              </td>
              <td>{team.teamName}</td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
              <td>{team.ties}</td>
              <td>{team.pointsFor}</td>
              <td>{team.pointsAgainst}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="help">Top {PLAYOFF_SPOTS} teams highlighted for playoffs</p>
    </div>
  );
};

export default StandingsTable; 