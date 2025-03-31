import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx"; // SignUp page
import Login from "./Login.jsx"; // Login page
import ForgotPassword from "./ForgotPassword.jsx"; // Forgot Password page
import Verify from "./Verify.jsx"; // Verify page
import ResetPassword from "./ResetPassword.jsx"; // Reset Password page
import HomePage from "./HomePage.jsx"; // Home page
import DoctorSignup from "./DoctorSignUp.jsx"; // Doctor SignUp page
import AppOfMaria from "./AppOfMaria.jsx"; // Main App page

// ✅ New Dashboard Imports
import DoctorDashboard from "./components/doctor_dashboard/LandingPage.jsx";
import PatientDashboard from "./components/patient_dashboard/src/dashboard.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup-patient" element={<App />} />
        <Route path="/signup-doctor" element={<DoctorSignup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<AppOfMaria />} />

        {/* ✅ New Routes for Dashboards */}
        <Route path="/dashboard-doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard-patient" element={<PatientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
