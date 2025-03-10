import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import SuccessModal from "./SuccessModal";
import FailModal from "./FailModal";
import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword modal

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for forgot password modal
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

        setMessage("Login successful! Redirecting...");
        setIsSuccess(true);
        setShowModal(true);

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
        setIsSuccess(false);
        setShowModal(true);
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" id="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" id="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Log In</button>
        </form>

        {/* Forgot Password Button */}
        <button className={styles["forgot-password-btn"]} onClick={() => setShowForgotPassword(true)}>
          Forgot Password?
        </button>
      </div>

      {/* Show success or failure modal */}
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

      {/* Render ForgotPassword modal if button is clicked */}
      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
}

export default Login;
// The Login component is a form that allows users to log in. When the form is submitted, a success modal is displayed with a message indicating that the login was successful. If the login fails, a failure modal is displayed with an error message. The component also includes a "Forgot Password?" button that opens the ForgotPassword modal when clicked.