import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";


// ← Replace all static imports with lazy imports
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const AuthPage = lazy(() => import("./Pages/auth/AuthPage"));
const ForgotPassword = lazy(() => import("./Pages/auth/ForgotPasswordPage"));
const VerifyPage = lazy(() => import("./Pages/auth/VerifyPage"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const FamilyDashboard = lazy(() => import("./Pages/FamilyDashboard"));

// Loading spinner shown while page loads
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      {" "}
      {/* ← wrap Routes in Suspense */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/family/:id" element={<FamilyDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
