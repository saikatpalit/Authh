import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import EmailVerify from "./Pages/EmailVerify";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";

import { AppContext } from "./context/AppContext";

// ─── Protected: must be logged in ────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isLoggedin, userData } = useContext(AppContext);
  if (!isLoggedin || !userData) return <Navigate to="/login" replace />;
  return children;
};

// ─── Admin only ───────────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { isLoggedin, userData } = useContext(AppContext);
  if (!isLoggedin || !userData) return <Navigate to="/login" replace />;
  if (userData.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

// ─── Guest only (redirect away if already logged in) ─────────────────────────
const GuestRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);
  if (isLoggedin) return <Navigate to="/" replace />;
  return children;
};

// ─── Google OAuth callback handler ───────────────────────────────────────────
// Backend redirects to: /google-callback?accessToken=...&...
// This component reads the token, saves it in context, then redirects home.


//deleting for google auth 2nd method

// const GoogleCallback = () => {
//   const { setIsLoggedin, setUserData, accessTokenRef } = useContext(AppContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const accessToken = params.get("accessToken");
//     const id = params.get("id");
//     const email = params.get("email");
//     const role = params.get("role");
//     const name = params.get("name");
//     const isEmailVerified = params.get("isEmailVerified") === "true";

//     if (accessToken) {
//       accessTokenRef.current = accessToken;
//       setIsLoggedin(true);
//       setUserData({ id, email, role, name, isEmailVerified });
//       navigate(role === "admin" ? "/admin" : "/", { replace: true });
//     } else {
//       navigate("/login?error=google_failed", { replace: true });
//     }
//   }, []);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
//       <div className="text-white text-lg">Signing you in...</div>
//     </div>
//   );
// };

const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/google-callback" element={<GoogleCallback />} /> */}

        {/* Guest only */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;