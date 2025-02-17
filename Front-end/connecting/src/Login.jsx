import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import SuccessModal from "./SuccessModal";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),  // ✅ Ensure no spaces in email
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.access);  // ✅ Store access token for authentication
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));  // ✅ Store user info
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setMessage(data.error || "Invalid credentials.");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
    }
    setShowModal(true);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Log In</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Log In</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
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

export default Login;
