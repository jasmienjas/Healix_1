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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("user_type", data.user.user_type);  // ✅ Store user type

        console.log("User Type:", data.user.user_type); // ✅ Debugging line

        // ✅ Redirect based on user role
        if (data.user.user_type === "admin") {
          window.location.href = "http://127.0.0.1:8000/admin/";  // ✅ Redirects admin to Django admin
        } else if (data.user.user_type === "doctor") {
          navigate("/dashboard-doctor");  // ✅ Redirect to Doctor Dashboard
        } else if (data.user.user_type === "patient") {
          navigate("/dashboard-patient");  // ✅ Redirect to Patient Dashboard
        } else {
          setMessage("Login successful! But no dashboard assigned.");
        }
      } else {
        setMessage(data.error || "Invalid credentials.");
      }
      setShowModal(true);
    } catch (error) {
      setMessage("Server error. Try again later.");
      setShowModal(true);
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
