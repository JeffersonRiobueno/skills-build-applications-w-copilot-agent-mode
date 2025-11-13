import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leaderboard/`);
      if (response.ok) {
        const data = await response.json();
        // Sort by points in descending order
        const sortedData = data.sort((a, b) => b.points - a.points);
        setLeaderboard(sortedData);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return 'bg-warning text-dark'; // Gold
    if (index === 1) return 'bg-secondary'; // Silver
    if (index === 2) return 'bg-danger'; // Bronze
    return 'bg-primary';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div>
      <h1 className="mb-4">Leaderboard</h1>

      <div className="card">
        <div className="card-header bg-dark text-white">
          <h5>Top Performers</h5>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-muted">No leaderboard data yet. Start tracking activities to see rankings!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id} className={index < 3 ? 'table-light' : ''}>
                      <td>
                        <span className={`badge ${getRankBadge(index)} fs-6`}>
                          {getRankIcon(index)}
                        </span>
                      </td>
                      <td>
                        <strong>{entry.user?.username || `User ${entry.user}`}</strong>
                      </td>
                      <td>
                        <strong>{entry.points}</strong> points
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="alert alert-info mt-4">
        <h6>How Points Work</h6>
        <p className="mb-0">
          Earn points by logging activities! The more activities you complete, the higher you'll rank.
          Keep pushing yourself to reach the top of the leaderboard!
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;
