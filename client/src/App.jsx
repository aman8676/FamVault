import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import AuthPage from "./Pages/auth/AuthPage";
import ForgotPasswordPage from "./Pages/auth/ForgotPasswordPage";
import VerifyPage from "./Pages/auth/VerifyPage";
import Dashboard from "./Pages/Dashboard";
import FamilyDashboard from "./Pages/FamilyDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/family/:id" element={<FamilyDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
