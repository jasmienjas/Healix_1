import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './App.module.css'; // Import the CSS module

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles['home-page']}> {/* Apply the new 'home-page' class */}
      <h1>Welcome! Sign up to Healix</h1>

      <div className={styles['button-container']}>
        <div className={styles['signup-box-doctor']}>
          <h2>Join as Doctor</h2>
          <button onClick={() => navigate("/signup-doctor")} className={styles['signup-button']}>
            Sign Up
          </button>
        </div>

        <div className={styles['signup-box-patient']}>
          <h2>Join as Patient</h2>
          <button onClick={() => navigate("/signup-patient")} className={styles['signup-button']}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Login Section */}
      <div className={styles['login-section']}>
        <h2>Already have an account?</h2>
        <button onClick={() => navigate("/login")} className={styles['login-button']}>
          Login
        </button>
      </div>
    </div>
  );
}

export default HomePage;
