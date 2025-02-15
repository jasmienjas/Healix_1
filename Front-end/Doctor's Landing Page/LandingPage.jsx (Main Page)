import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CalendarComponent from "./components/CalendarComponent";
import DashboardSummary from "./components/DashboardSummary";
import Footer from "./components/Footer";
import DarkModeToggle from "./components/DarkModeToggle";
import "./LandingPage.css";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`landing-container ${darkMode ? "dark-mode" : ""}`}>
      <Header />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <DashboardSummary />
      <div className="main-content">
        <Sidebar />
        <CalendarComponent />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
