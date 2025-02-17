import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./App.css"; // Import styles
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function PatientSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
  });

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [message, setMessage] = useState(""); // State for the modal message
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, dob } = formData;

    if (!username || !email || !password || !dob) {
      setMessage("Please fill in all fields."); // Failure message
      setShowModal(true); // Show modal with failure message
    } else {
      setMessage(`Signup successful!\nWelcome, ${username}!`); // Success message with username
      setShowModal(true); // Show modal with success message
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirmModal = () => {
    setShowModal(false); // Close the modal
    navigate("/login"); // Redirect to login page after signup success
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Patient Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
      </div>

      {/* Conditionally render SuccessModal */}
      {showModal && (
        <SuccessModal
          message={message} // Passing dynamic message based on form success or failure
          onClose={handleCloseModal} // Close button handler
          onConfirm={handleConfirmModal} // Continue button handler
        />
      )}
    </div>
  );
}

export default PatientSignup;
