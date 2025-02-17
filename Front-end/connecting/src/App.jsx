import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./App.css"; 
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Ensure dob is formatted correctly (YYYY-MM-DD)
    const formattedDob = new Date(formData.dob).toISOString().split("T")[0];

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        dob: formattedDob,  // ✅ Ensure the correct format
        user_type: "patient",  // ✅ Explicitly set user type to "patient"
      };

      const response = await fetch("http://127.0.0.1:8000/api/accounts/register/", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || JSON.stringify(data));  // ✅ Show actual server error message
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
        <h2>Patient Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" id="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" id="dob" onChange={handleChange} required />
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

export default PatientSignup;
