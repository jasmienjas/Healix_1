import React, { useState, useEffect } from "react";
import "./App.css"; // Your main styles
import "./dark-mode.css"; // Import dark mode styles separately

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage when the app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, []);

  // Toggle function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (!isDarkMode) {
      document.body.classList.replace("light-mode", "dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.replace("dark-mode", "light-mode");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div>
      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} className={isDarkMode ? "dark-mode" : ""}>
        Switch to {isDarkMode ? "Light" : "Dark"} Mode
      </button>

      <h1 className={isDarkMode ? "dark-mode" : ""}>
        Welcome to {isDarkMode ? "Dark" : "Light"} Mode!
      </h1>

      {/* Example elements applying dark mode */}
      <header className={isDarkMode ? "dark-mode" : ""}>My Website Header</header>
      <div className={`testimonial-box ${isDarkMode ? "dark-mode" : ""}`}>
        Dark mode changes this box!
      </div>
    </div>
  );
};

export default App;
