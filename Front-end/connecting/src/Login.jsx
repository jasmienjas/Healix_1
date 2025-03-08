import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import SuccessModal from "./SuccessModal";
import FailModal from "./FailModal"; // ✅ Import FailModal

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // ✅ State to track success or failure
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
        localStorage.setItem("user_type", data.user.user_type);

        console.log("User Type:", data.user.user_type); // ✅ Debugging log

        setMessage("Login successful! Redirecting...");
        setIsSuccess(true); // ✅ Set success state
        setShowModal(true);

        // ✅ Redirect based on user role after modal is closed
        setTimeout(() => {
          if (data.user.user_type === "admin") {
            window.location.href = "http://127.0.0.1:8000/admin/";
          } else if (data.user.user_type === "doctor") {
            navigate("/dashboard-doctor");
          } else if (data.user.user_type === "patient") {
            navigate("/dashboard-patient");
          }
        }, 2000);
      } else {
        setMessage(data.error || "Invalid credentials.");
        setIsSuccess(false); // ❌ Set failure state
        setShowModal(true);
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <div className="login-page">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>

      {showModal && (
        isSuccess ? (
          <SuccessModal
            message={message}
            onClose={() => setShowModal(false)}
          />
        ) : (
          <FailModal
            message={message}
            onClose={() => setShowModal(false)}
          />
        )
      )}
    </div>
  );
}

export default Login;
