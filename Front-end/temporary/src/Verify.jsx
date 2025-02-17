import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Optional, style it as per your design
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function Verify() {
  const [verificationCode, setVerificationCode] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [message, setMessage] = useState(""); // State for the modal message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationCode) {
      const successMessage = `Verification code entered: ${verificationCode}`;
      setMessage(successMessage); // Set the success message
      setShowModal(true); // Show the modal
    } else {
      alert("Please enter the verification code.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirmModal = () => {
    setShowModal(false); // Close the modal
    navigate("/reset-password"); // Redirect to reset password page after verification
  };

  return (
    <div className="verify-page">
      <div className="verify-container">
        <h2>Enter Verification Code</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="verificationCode"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={handleChange}
            required
          />
          <button type="submit">Verify Code</button>
        </form>
        <p>
          Didn't receive the code? <a href="/forgot-password" className="resend-link">Resend</a>
        </p>
      </div>

      {/* Conditionally render SuccessModal */}
      {showModal && (
        <SuccessModal
          message={message}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
        />
      )}
    </div>
  );
}

export default Verify;
