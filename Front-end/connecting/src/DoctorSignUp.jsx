import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from  "./App.module.css";
import SuccessModal from "./SuccessModal";

function DoctorSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    phd_certificate: null,  // ✅ Ensure field matches Django model
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, phd_certificate: e.target.files[0] }); // ✅ Use correct field name
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("user_type", "doctor");  // ✅ Explicitly specify "doctor"
    if (formData.phd_certificate) {
      formDataToSend.append("phd_certificate", formData.phd_certificate); // ✅ Fix field name
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/register/", {  
        method: "POST",
        body: formDataToSend,  // ✅ FormData instead of JSON
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
    <div className={styles['signup-page']}>
      <div className={styles['signup-container']}>
        <h2>Doctor Sign Up</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* ✅ Important for file upload */}
          <input type="text" id="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" id="dob" onChange={handleChange} required />
          <input type="file" id="phd_certificate" onChange={handleFileChange} required /> {/* ✅ Correct field name */}
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
