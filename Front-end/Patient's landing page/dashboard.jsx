import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Your Dashboard</h1>
      <div className="dashboard-links grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Book Appointment */}
        <div className="dashboard-card">
          <Link to="/appointments" className="btn">
            <span className="btn-text">Book Appointment</span>
          </Link>
        </div>
        {/* Fitness */}
        <div className="dashboard-card">
          <Link to="/fitness" className="btn">
            <span className="btn-text">Fitness</span>
          </Link>
        </div>
        {/* Doctors */}
        <div className="dashboard-card">
          <Link to="/doctors" className="btn">
            <span className="btn-text">Doctors</span>
          </Link>
        </div>
        {/* Check Files */}
        <div className="dashboard-card">
          <Link to="/files" className="btn">
            <span className="btn-text">Check Files</span>
          </Link>
        </div>
        {/* Video Call */}
        <div className="dashboard-card">
          <Link to="/video-call" className="btn">
            <span className="btn-text">Video Call</span>
          </Link>
        </div>
        {/* AI Chat */}
        <div className="dashboard-card">
          <Link to="/ai-chat" className="btn">
            <span className="btn-text">AI Chat</span>
          </Link>
        </div>
        {/* Emergency */}
        <div className="dashboard-card">
          <Link to="/emergency" className="btn bg-red-600 text-white">
            <span className="btn-text">Emergency</span>
          </Link>
        </div>
        {/* Nearby Pharmacies */}
        <div className="dashboard-card">
          <Link to="/pharmacies" className="btn">
            <span className="btn-text">Nearby Pharmacies</span>
          </Link>
        </div>
        {/* Health Tracking */}
        <div className="dashboard-card">
          <Link to="/health-tracking" className="btn">
            <span className="btn-text">Health Tracking</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
