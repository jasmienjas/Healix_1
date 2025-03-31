import React from "react";
import "./SuccessModal.css"; // Create a separate CSS file for styling

function FailModal({ message, onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🚨 Fail! Try Again.</h3>
        <p>{message}</p>
        {onConfirm && <button onClick={onConfirm}>Continue</button>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default FailModal;
