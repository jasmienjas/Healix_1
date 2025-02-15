import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Make sure to add styling here
import { FaUserMd, FaDumbbell, FaCalendarAlt, FaFileMedical, FaVideo, FaRobot, FaAmbulance, FaMapMarkerAlt, FaCapsules, FaHeartbeat, FaCog, FaBell } from 'react-icons/fa';

function App() {
  return (
    <Router>
      <div className="bg-blue-800 min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/files" element={<Files />} />
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/pharmacies" element={<NearbyPharmacies />} />
          <Route path="/health-tracking" element={<HealthTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
