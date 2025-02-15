import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate imported to redirect
import "./App.css"; // Import CSS for styles
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [message, setMessage] = useState(""); // State for modal message
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      alert("Please fill in all fields.");
    } else {
      const successMessage = `Login Successful!\nEmail: ${email}`;
      setMessage(successMessage); // Set success message for modal
      setShowModal(true); // Show the modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirmModal = () => {
    setShowModal(false); // Close the modal after confirming
    navigate("/dashboard"); // Redirect to dashboard or homepage after login
  };

  return (
    <div className="login-page">
      <div className="waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="login-container">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Log In</button>
        </form>
        <p>
          Don't have an account? <Link to="/sign-up" className="login-link">Sign up</Link>
        </p>
        <p>
          <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
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

export default Login;
