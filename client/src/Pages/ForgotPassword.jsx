import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/auth/forgot-password`, { email });
      toast.success(data.message);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-white">
      {/* <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      /> */}
      <h1
  onClick={() => navigate("/")}
  className="absolute left-5 sm:left-20 top-5 text-4xl font-bold cursor-pointer"
>
  auth<span style={{ color: "#39ff14" }}>.</span>
</h1>

      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h1>

        {!sent ? (
          <>
            <p className="text-center mb-6" style={{ color: "#39ff14" }}>
              Enter your registered email and we'll send you a reset link.
            </p>
            <form onSubmit={onSubmit}>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="mail_icon" className="w-3 h-3" />
                <input
                  type="email"
                  placeholder="Email id"
                  className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full font-medium mt-3 disabled:opacity-50"
                style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <p className="mb-2" style={{ color: "#39ff14" }}>Reset link sent!</p>
            <p className="text-gray-400 text-xs mb-6">
              If an account with that email exists, a password reset link has been sent.
              Check your inbox (and spam folder).
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-full font-medium"
              style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
            >
              Back to Login
            </button>
          </div>
        )}

        {!sent && (
          <p className="text-gray-400 text-center text-xs mt-4">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer underline"
              style={{ color: "#39ff14" }}
            >
              Login here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;