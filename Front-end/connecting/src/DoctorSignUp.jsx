import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import SuccessModal from "./SuccessModal";

function DoctorSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    certification: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, certification: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("certification", formData.certification);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/doctor-register/", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Doctor Signup Successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Signup failed.");
      }
      setShowModal(true);
    } catch (error) {
      setMessage("Server error. Try again later.");
      setShowModal(true);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Doctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" id="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" id="dob" onChange={handleChange} required />
          <input type="file" id="certification" onChange={handleFileChange} required />
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>

      {showModal && (
        <SuccessModal
          message={message}
          onClose={() => setShowModal(false)}
          onConfirm={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default DoctorSignup;
