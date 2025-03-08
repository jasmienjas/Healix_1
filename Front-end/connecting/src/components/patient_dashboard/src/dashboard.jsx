import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import the CSS Module

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Welcome to Your Dashboard</h1>
      <div className={styles.dashboardLinks}>
        {/* Book Appointment */}
        <div className={styles.dashboardCard}>
          <Link to="/appointments" className={styles.btn}>
            <span className={styles.btnText}>Book Appointment</span>
          </Link>
        </div>
        {/* Fitness */}
        <div className={styles.dashboardCard}>
          <Link to="/fitness" className={styles.btn}>
            <span className={styles.btnText}>Fitness</span>
          </Link>
        </div>
        {/* Doctors */}
        <div className={styles.dashboardCard}>
          <Link to="/doctors" className={styles.btn}>
            <span className={styles.btnText}>Doctors</span>
          </Link>
        </div>
        {/* Check Files */}
        <div className={styles.dashboardCard}>
          <Link to="/files" className={styles.btn}>
            <span className={styles.btnText}>Check Files</span>
          </Link>
        </div>
        {/* Video Call */}
        <div className={styles.dashboardCard}>
          <Link to="/video-call" className={styles.btn}>
            <span className={styles.btnText}>Video Call</span>
          </Link>
        </div>
        {/* AI Chat */}
        <div className={styles.dashboardCard}>
          <Link to="/ai-chat" className={styles.btn}>
            <span className={styles.btnText}>AI Chat</span>
          </Link>
        </div>
        {/* Emergency */}
        <div className={styles.dashboardCard}>
          <Link to="/emergency" className={`${styles.btn} ${styles.emergencyBtn}`}>
            <span className={styles.btnText}>Emergency</span>
          </Link>
        </div>
        {/* Nearby Pharmacies */}
        <div className={styles.dashboardCard}>
          <Link to="/pharmacies" className={styles.btn}>
            <span className={styles.btnText}>Nearby Pharmacies</span>
          </Link>
        </div>
        {/* Health Tracking */}
        <div className={styles.dashboardCard}>
          <Link to="/health-tracking" className={styles.btn}>
            <span className={styles.btnText}>Health Tracking</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
