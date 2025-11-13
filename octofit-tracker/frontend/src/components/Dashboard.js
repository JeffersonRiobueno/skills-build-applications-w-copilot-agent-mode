import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalDistance: 0,
    totalDuration: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
    fetchWorkouts();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/activities/`);
      if (response.ok) {
        const activities = await response.json();
        const userActivities = activities.filter(a => a.user === user?.id);
        
        const totalDistance = userActivities.reduce((sum, a) => sum + (a.distance || 0), 0);
        const totalDuration = userActivities.reduce((sum, a) => sum + (a.duration || 0), 0);

        setStats({
          totalActivities: userActivities.length,
          totalDistance: totalDistance.toFixed(2),
          totalDuration: totalDuration,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/activities/`);
      if (response.ok) {
        const activities = await response.json();
        const userActivities = activities.filter(a => a.user === user?.id);
        setRecentActivities(userActivities.slice(-5).reverse());
      }
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/workouts/`);
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Activities</h5>
              <h2>{stats.totalActivities}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Distance</h5>
              <h2>{stats.totalDistance} km</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total Duration</h5>
              <h2>{stats.totalDuration} min</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activities</h5>
            </div>
            <div className="card-body">
              {recentActivities.length === 0 ? (
                <p className="text-muted">No activities yet. Start tracking!</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{activity.type}</strong> - {activity.distance} km in {activity.duration} min
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Suggested Workouts */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Suggested Workouts</h5>
            </div>
            <div className="card-body">
              {workouts.length === 0 ? (
                <p className="text-muted">No workouts available yet.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {workouts.map((workout, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{workout.name}</strong>
                      <p className="mb-1 small">{workout.description}</p>
                      <span className="badge bg-secondary">{workout.duration} min</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
