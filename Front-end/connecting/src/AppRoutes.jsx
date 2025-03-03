import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App"; // SignUp page
import Login from "./Login"; // Login page
import ForgotPassword from "./ForgotPassword"; // Forgot Password page
import Verify from "./Verify"; // Verify page
import ResetPassword from "./ResetPassword"; // Reset Password page
import HomePage from "./HomePage"; // Home page
import DoctorSignup from "./DoctorSignUp"; // Doctor SignUp page
import AppOfMaria from "./AppOfMaria"; // Main App page

// ✅ New Dashboard Imports
import DoctorDashboard from "./components/doctor_dashboard/LandingPage";
import PatientDashboard from "./components/patient_dashboard/dashboard";

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
