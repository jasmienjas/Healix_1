import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Dashboard.css'; 
import AIChat from './AIchat';
import Appointments from './appointments';
import Emergency from './Emergency';
import Dashboard from './dashboard';
import LandingPage from './LandingPage';
import Notifications from './Notifcations';
import VideoCall from './videocall';
import Navbar from './Navbar';
import NearbyPharmacies from './nearbypharmacies';
import HealthTracking from './HealthTracking';
import Files from './files';
import Fitness from './fitness';
import Doctors from './doctors';
import Settings from './settings';

function App() {
  return (
    <Router>
      <div className="bg-blue-800 min-h-screen text-white">
        {/* Move Navbar outside Routes */}
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
