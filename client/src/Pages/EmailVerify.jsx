import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  // Auto-verify when user lands here via the email link (?token=...)
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (tkn) => {
    setStatus("loading");
    try {
      const { data } = await axios.get(`${backendUrl}/auth/verify-email`, {
        params: { token: tkn },
      });
      setStatus("success");
      setMessage(data.message || "Email verified successfully!");
      toast.success(data.message || "Email verified!");
    } catch (error) {
      setStatus("error");
      const msg = error.response?.data?.message || "Verification failed";
      setMessage(msg);
      toast.error(msg);
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

      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm text-center">
        <h1 className="text-white text-2xl font-semibold mb-4">
          Email Verification
        </h1>

        {/* No token — user navigated here manually */}
        {!token && status === "idle" && (
          <>
            <p className="mb-6" style={{ color: "#39ff14" }}>
              Check your inbox for a verification email and click the link inside.
            </p>
            <p className="text-gray-500 text-xs mb-6">
              The link in your email will automatically verify your account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-full text-white"
              style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
            >
              Back to Login
            </button>
          </>
        )}

        {/* Verifying */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#39ff14", borderTopColor: "transparent" }} />
            <p style={{ color: "#39ff14" }}>Verifying your email...</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <p className="mb-6" style={{ color: "#39ff14" }}>{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-full font-medium"
              style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
            >
              Go to Login
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <p className="text-red-400 mb-2">{message}</p>
            <p className="text-gray-500 text-xs mb-6">
              The link may have expired (valid for 24h). Try registering again.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-full font-medium"
              style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;