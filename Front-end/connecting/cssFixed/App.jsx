import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import SuccessModal from "./SuccessModal";

function PatientSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, dob } = formData;

    if (!username || !email || !password || !dob) {
      setMessage("Please fill in all fields.");
      setShowModal(true);
    } else {
      setMessage(`Signup successful!\nWelcome, ${username}!`);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className={styles['signup-page']}> {/* Apply the 'signup-page' class to cover the whole page */}
      <div className={styles['signup-container']}>
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
          Already have an account? <Link to="/login" className={styles['login-link']}>Log in</Link>
        </p>
      </div>

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

export default PatientSignup;
