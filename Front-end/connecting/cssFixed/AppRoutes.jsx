import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App"; // SignUp page
import Login from "./Login"; // Login page
import ForgotPassword from "./ForgotPassword"; // Forgot Password page
import Verify from "./Verify"; // Verify page
import ResetPassword from "./ResetPassword"; // Reset Password page
import HomePage from "./HomePage";
import DoctorSignup from "./DoctorSignUp";
import AppOfMaria from "./AppOfMaria";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup-patient" element={<App />} /> 
        <Route path="/signup-doctor" element={<DoctorSignup />} />
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/" element={<AppOfMaria />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
