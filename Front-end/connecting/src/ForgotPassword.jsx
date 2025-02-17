import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate is imported
import "./App.css"; // Optional, create this file for styling
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [message, setMessage] = useState(""); // State for modal message
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const successMessage = `Verification code sent to: ${email}`;
      setMessage(successMessage); // Set the success message
      setShowModal(true); // Show the modal
    } else {
      alert("Please enter your email.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirmModal = () => {
    setShowModal(false); // Close the modal after confirm
    navigate("/verify"); // Navigate to the verify page
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Verification Code</button>
        </form>
        <p>
          Remember your password?{" "}
          <Link to="/login" className="back-to-login-link">
            Log in
          </Link>
        </p>
      </div>

      {/* Conditionally render the SuccessModal */}
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

export default ForgotPassword;
