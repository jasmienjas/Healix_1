import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css"; // Import styles

function DoctorSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    certification: null,
  });

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
      alert(`Doctor Signup Successful!\nUsername: ${username}\nEmail: ${email}\nCertification Uploaded: ${certification.name}`);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Doctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" id="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="date" id="dob" value={formData.dob} onChange={handleChange} required />
          
          <label htmlFor="certification" className="file-label">Upload Certification</label>
          <input type="file" id="certification" onChange={handleFileChange} required />
          
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login" className="login-link">Log in</Link></p>
      </div>
    </div>
  );
}

export default DoctorSignup;
