import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './App.module.css'; // Import the CSS module
import SuccessModal from "./SuccessModal"; // Import SuccessModal
import FailModal from "./FailModal"; // Import FailModal

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for the modal message
  const [isSuccess, setIsSuccess] = useState(true); // Track if it's a success or failure
  const navigate = useNavigate();

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setIsSuccess(false);
      setModalMessage("Please fill in both fields.");
      setShowModal(true); // Show the modal with the error message
    } else if (newPassword !== confirmPassword) {
      setIsSuccess(false);
      setModalMessage("Passwords do not match.");
      setShowModal(true); // Show the modal with the error message
    } else {
      setIsSuccess(true);
      setModalMessage("Password reset successful!");
      setShowModal(true); // Show the success modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirmModal = () => {
    setShowModal(false); // Close the modal
    if (isSuccess) {
      navigate("/login"); // Redirect to login page after password reset
    }
  };

  return (
    <div className={styles['reset-password-page']}>
      <div className={styles['reset-password-container']}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            id="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={handleChangeNewPassword}
            required
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>

      {/* Conditionally render SuccessModal or FailModal */}
      {showModal && isSuccess && (
        <SuccessModal
          message={modalMessage}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
        />
      )}

      {showModal && !isSuccess && (
        <FailModal
          message={modalMessage}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
        />
      )}
    </div>
  );
}

export default ResetPassword;
