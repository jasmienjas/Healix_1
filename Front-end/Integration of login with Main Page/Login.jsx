import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for redirection
import "./App.css"; // Import CSS for styles
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "Patient", // Default to Patient
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, accountType } = formData;

    if (!email || !password || !accountType) {
      alert("Please fill in all fields.");
    } else {
      const successMessage = `Login Successful!\nEmail: ${email}\nAccount Type: ${accountType}`;
      setMessage(successMessage); // Set success message
      setShowModal(true); // Show modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    // Redirect based on account type
    if (formData.accountType === "Patient") {
      navigate("/patientdashboard");
    } else if (formData.accountType === "Doctor") {
      navigate("/doctordashboard");
    }else if (formData.accountType === "Adminstrator"){
      navigate("/admindashbaord");
    }
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
          {/* Dropdown for Account Type */}
          <select id="accountType" value={formData.accountType} onChange={handleChange} required>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Adminstrator">Adminstrator </option>
          </select>

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
