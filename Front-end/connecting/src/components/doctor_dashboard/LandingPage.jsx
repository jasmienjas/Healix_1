import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CalendarComponent from "./CalendarComponent";
import DashboardSummary from "./DashboardSummary";
import Footer from "./Footer";
import DarkModeToggle from "./DarkModeToggle";
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
