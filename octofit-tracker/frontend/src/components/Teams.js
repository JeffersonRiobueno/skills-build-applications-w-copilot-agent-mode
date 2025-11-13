import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Teams({ user }) {
  const [teams, setTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teams/`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
        
        // Find user's team
        if (user?.team) {
          const userTeam = data.find(t => t.id === user.team);
          setMyTeam(userTeam);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch(`${API_URL}/api/teams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: teamName }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        
        // Update user's team
        await fetch(`${API_URL}/api/users/${user.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ team: newTeam.id }),
        });

        setTeamName('');
        fetchTeams();
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team: teamId }),
      });

      if (response.ok) {
        fetchTeams();
      }
    } catch (error) {
      console.error('Failed to join team:', error);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Teams</h1>

      {/* Current Team */}
      {myTeam && (
        <div className="alert alert-success mb-4">
          <h5>Your Current Team</h5>
          <p className="mb-0"><strong>{myTeam.name}</strong></p>
        </div>
      )}

      {/* Create Team Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Create New Team</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateTeam}>
            <div className="row">
              <div className="col-md-8 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Available Teams */}
      <div className="card">
        <div className="card-header">
          <h5>Available Teams</h5>
        </div>
        <div className="card-body">
          {teams.length === 0 ? (
            <p className="text-muted">No teams available. Create the first one!</p>
          ) : (
            <div className="row">
              {teams.map((team) => (
                <div key={team.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{team.name}</h5>
                      {myTeam?.id !== team.id && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleJoinTeam(team.id)}
                        >
                          Join Team
                        </button>
                      )}
                      {myTeam?.id === team.id && (
                        <span className="badge bg-success">Current Team</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teams;
