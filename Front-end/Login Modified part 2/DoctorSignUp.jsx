import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./App.css"; // Import styles
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function DoctorSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    certification: null,
  });

  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [message, setMessage] = useState(""); // Message to pass to SuccessModal
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, certification: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, dob, certification } = formData;
    if (!username || !email || !password || !dob || !certification) {
      alert("Please fill in all fields and upload certification.");
    } else {
      // Prepare success message
      const successMessage = `Doctor Signup Successful!\nUsername: ${username}\nEmail: ${email}\nCertification Uploaded: ${certification.name}`;
      setMessage(successMessage); // Set the success message
      setShowModal(true); // Show the modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirmModal = () => {
    setShowModal(false); // Close the modal after confirm
    navigate("/login"); // Redirect to the login page after confirming
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Doctor Sign Up</h2>
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

          <label htmlFor="certification" className="file-label">Upload Certification</label>
          <input
            type="file"
            id="certification"
            onChange={handleFileChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
      </div>

      {/* Conditionally render the SuccessModal */}
      {showModal && (
        <SuccessModal
          message={message} // Pass success message to the modal
          onClose={handleCloseModal} // Close button handler
          onConfirm={handleConfirmModal} // Continue button handler
        />
      )}
    </div>
  );
}

export default DoctorSignup;
