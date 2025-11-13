import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import logo from './octofitapp-small.png';
import './App.css';

// Component imports
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="OctoFit" height="40" className="me-2" />
              OctoFit Tracker
            </Link>
            {isAuthenticated && (
              <>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/activities">Activities</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/teams">Teams</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                    </li>
                  </ul>
                  <div className="d-flex">
                    <span className="navbar-text me-3">
                      Welcome, {currentUser?.username || 'User'}
                    </span>
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/activities" element={
              isAuthenticated ? <Activities user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/teams" element={
              isAuthenticated ? <Teams user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/leaderboard" element={
              isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />
            } />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
