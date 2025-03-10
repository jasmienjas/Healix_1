import React, { useState } from "react";
import styles from "./App.module.css"; // Use existing styles
import SuccessModal from "./SuccessModal"; // Import SuccessModal

function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setMessage(`One-time password (OTP) sent to: ${email}`);
      setShowSuccessModal(true);
    } else {
      alert("Please enter your email.");
    }
  };

  const handleConfirmModal = () => {
    setShowSuccessModal(false);
    onClose(); // Close both modals
  };

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        {/* ✅ Title above the input field */}
        <h2 className={styles["modal-title"]}>Send One Time Password</h2> 

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Verification Code</button>
        </form>
        <button className={styles["close-button"]} onClick={onClose}>
          Close
        </button>
      </div>

      {/* Success Message Modal */}
      {showSuccessModal && (
        <SuccessModal
          message={message}
          onClose={handleConfirmModal}
          onConfirm={handleConfirmModal}
        />
      )}
    </div>
  );
}

export default ForgotPassword;

// The ForgotPassword component is a form that allows users to request a password reset by entering their email address. When the form is submitted, a success modal is displayed with a message indicating that a verification code has been sent to the provided email address.
