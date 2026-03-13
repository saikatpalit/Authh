import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Token comes from the email link: /reset-password?token=...
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/auth/reset-password`, {
        token,    // raw token from URL
        password,
      });
      toast.success(data.message || "Password reset successfully!");
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-white">
      <h1
  onClick={() => navigate("/")}
  className="absolute left-5 sm:left-20 top-5 text-4xl font-bold cursor-pointer"
>
  auth<span style={{ color: "#39ff14" }}>.</span>
</h1>

      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>

        {/* No token in URL */}
        {!token && (
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-400 mb-2">Invalid reset link</p>
            <p className="text-gray-400 text-xs mb-6">
              The reset link is missing or malformed. Request a new one.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full py-2.5 rounded-full font-medium"
              style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
            >
              Request New Link
            </button>
          </div>
        )}

        {/* Token present, form */}
        {token && !done && (
          <>
            <p className="text-center mb-6" style={{ color: "#39ff14" }}>
              Enter your new password below.
            </p>
            <form onSubmit={onSubmit}>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="lock_icon" className="w-3 h-3" />
                <input
                  type="password"
                  placeholder="New password"
                  className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="lock_icon" className="w-3 h-3" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full font-medium mt-3 disabled:opacity-50"
                style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
              >
                {loading ? "Resetting..." : "Set New Password"}
              </button>
            </form>
          </>
        )}

        {/* Success */}
        {done && (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="mb-2" style={{ color: "#39ff14" }}>Password reset!</p>
            <p className="text-gray-400 text-xs">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;