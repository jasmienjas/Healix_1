import React, { useState, useRef } from "react";
import "./AppOfMaria.css"; // Import the external CSS file

const EmergencyButton = () => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  // Start tracking the button hold
  const startHold = () => {
    let startTime = Date.now();
    timerRef.current = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let percentage = (elapsed / 3000) * 100; // 3000 ms = 3 seconds
      if (percentage >= 100) {
        clearInterval(timerRef.current);
        window.location.href = "about:blank"; // Redirects to a blank page after 3 seconds
      }
      setProgress(percentage);
    }, 50);
  };

  // Cancel the button hold
  const cancelHold = () => {
    clearInterval(timerRef.current);
    setProgress(0);
  };

  return (
    <div className="emergency-button-container">
      <button
        className="emergency-button"
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
      >
        Emergency
        <div className="fill" style={{ width: `${progress}%` }}></div>
      </button>
    </div>
  );
};

export default EmergencyButton;
