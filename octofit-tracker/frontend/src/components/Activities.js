import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Activities({ user }) {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    type: 'Running',
    duration: '',
    distance: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/activities/`);
      if (response.ok) {
        const data = await response.json();
        const userActivities = data.filter(a => a.user === user?.id);
        setActivities(userActivities);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/activities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user.id,
          type: formData.type,
          duration: parseInt(formData.duration),
          distance: parseFloat(formData.distance),
        }),
      });

      if (response.ok) {
        setFormData({ type: 'Running', duration: '', distance: '' });
        fetchActivities();
      }
    } catch (error) {
      console.error('Failed to create activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1 className="mb-4">Activities</h1>

      {/* Add Activity Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Log New Activity</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="type" className="form-label">Activity Type</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Walking">Walking</option>
                  <option value="Gym">Gym</option>
                  <option value="Yoga">Yoga</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="distance" className="form-label">Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                  min="0.1"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging...' : 'Log Activity'}
            </button>
          </form>
        </div>
      </div>

      {/* Activities List */}
      <div className="card">
        <div className="card-header">
          <h5>My Activities</h5>
        </div>
        <div className="card-body">
          {activities.length === 0 ? (
            <p className="text-muted">No activities logged yet. Start by adding one above!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Duration (min)</th>
                    <th>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.type}</td>
                      <td>{activity.duration}</td>
                      <td>{activity.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
