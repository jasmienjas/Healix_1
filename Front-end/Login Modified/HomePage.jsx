import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Import styles

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome! Sign up to Healix</h1>
      <div className="button-container">
        <div className="signup-box doctor">
          <h2>Join as Doctor</h2>
          <button onClick={() => navigate("/signup-doctor")} className="signup-button">Sign Up</button>
        </div>
        <div className="signup-box patient">
          <h2>Join as Patient</h2>
          <button onClick={() => navigate("/signup-patient")} className="signup-button">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
