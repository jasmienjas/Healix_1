import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaDumbbell, FaCalendarAlt, FaFileMedical, FaVideo, FaRobot, FaAmbulance, FaCapsules, FaHeartbeat, FaCog, FaBell } from 'react-icons/fa';

function Navbar() {
  return (
    <div className="bg-blue-900 p-4 flex justify-between items-center text-white shadow-lg">
      <Link to="/" className="text-xl font-bold">Healix</Link>
      <div className="flex space-x-4">
        <Link to="/dashboard" className="btn">Dashboard</Link>
        <Link to="/settings" className="btn"><FaCog className="mr-2" />Settings</Link>
        <Link to="/notifications" className="btn"><FaBell className="mr-2" />Notifications</Link>
        <Link to="/doctors" className="btn"><FaUserMd className="mr-2" />Doctors</Link>
        <Link to="/fitness" className="btn"><FaDumbbell className="mr-2" />Fitness</Link>
        <Link to="/appointments" className="btn"><FaCalendarAlt className="mr-2" />Appointments</Link>
        <Link to="/files" className="btn"><FaFileMedical className="mr-2" />Files</Link>
        <Link to="/video-call" className="btn"><FaVideo className="mr-2" />Video Call</Link>
        <Link to="/ai-chat" className="btn"><FaRobot className="mr-2" />AI Chat</Link>
        <Link to="/emergency" className="btn bg-red-600"><FaAmbulance className="mr-2" />Emergency</Link>
        <Link to="/pharmacies" className="btn"><FaCapsules className="mr-2" />Pharmacies</Link>
        <Link to="/health-tracking" className="btn"><FaHeartbeat className="mr-2" />Health Tracking</Link>
      </div>
    </div>
  );
}

export default Navbar;

