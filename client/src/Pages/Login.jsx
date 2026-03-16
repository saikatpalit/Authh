import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
// import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { backendUrl, setIsLoggedin, setUserData, accessTokenRef, authAxios } =
    useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [need2FA, setNeed2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Show error if Google login failed
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_failed") toast.error("Google sign-in failed. Please try again.");
    if (error === "google_unverified") toast.error("Your Google email is not verified.");
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ─── SIGN UP ────────────────────────────────────────────────────────────
      if (state === "Sign Up") {
        await authAxios.post("/auth/register", { name, email, password });
toast.success("Account created! Check your email to verify your account.");
navigate("/email-verify");
        setName("");
        setPassword("");
        setLoading(false);
        return;
      }

      // ─── LOGIN ──────────────────────────────────────────────────────────────
      const payload = { email, password };
      if (need2FA) payload.twoFactorCode = twoFactorCode;

      const { data } = await authAxios.post("/auth/login", payload);

      // ✅ Store access token in memory (ref) — never localStorage
      accessTokenRef.current = data.accessToken;
      setIsLoggedin(true);
      setUserData(data.user);   // includes name now

      toast.success("Logged in successfully!");
      navigate(data.user.role === "admin" ? "/admin" : "/");

    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";

      // Backend says 2FA is required
      if (msg.toLowerCase().includes("two factor")) {
        setNeed2FA(true);
        toast.info("Enter your 2FA code to continue.");
        setLoading(false);
        return;
      }

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

//   const handleGoogleLogin = async (credential) => {
//   try {
//     const { data } = await authAxios.post("/auth/google", { token: credential });

//     accessTokenRef.current = data.accessToken;
//     setIsLoggedin(true);
//     setUserData(data.user);

//     toast.success("Logged in with Google!");
//     navigate(data.user.role === "admin" ? "/admin" : "/");
//   } catch (error) {
//     toast.error(error.response?.data?.message || "Google login failed");
//   }
// };

  const switchState = (newState) => {
    setState(newState);
    setNeed2FA(false);
    setTwoFactorCode("");
  };

  return (
<div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-white">
<h1
  onClick={() => navigate("/")}
  className="absolute left-5 sm:left-20 top-5 text-4xl font-bold cursor-pointer"
>
  auth<span style={{ color: "#39ff14" }}>.</span>
</h1>

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : need2FA ? "Two-Factor Auth" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: "#39ff14" }}>
          {state === "Sign Up"
            ? "Create your account"
            : need2FA
            ? "Enter the 6-digit code from your authenticator app"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* Name — Sign Up only */}
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="person_icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                type="text"
                placeholder="Full Name"
                required
                minLength={3}
              />
            </div>
          )}

          {/* Email + Password — hidden on 2FA screen */}
          {!need2FA && (
            <>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="mail_icon" />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                  type="email"
                  placeholder="Email id"
                  required
                />
              </div>

              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="lock_icon" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                  type="password"
                  placeholder="Password"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          {/* 2FA code */}
          {need2FA && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <span className="text-gray-400 text-lg">🔑</span>
              <input
                onChange={(e) => setTwoFactorCode(e.target.value)}
                value={twoFactorCode}
                className="bg-transparent outline-none w-full text-white placeholder-gray-400 tracking-widest text-lg"
                type="text"
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
            </div>
          )}

          {/* Forgot password */}
          {state === "Login" && !need2FA && (
            <p
              onClick={() => navigate("/forgot-password")}
              className="mb-4 cursor-pointer"
              style={{ color: "#39ff14" }}
            >
              Forgot password?
            </p>
          )}

          {/* Back from 2FA */}
          {need2FA && (
            <p
              onClick={() => { setNeed2FA(false); setTwoFactorCode(""); }}
              className="mb-4 text-gray-500 cursor-pointer hover:text-gray-400 text-xs"
            >
              ← Back
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ background: "linear-gradient(to right, #39ff14, #00cc00)" }}
          >
            {loading
              ? "Please wait..."
              : state === "Sign Up"
              ? "Create Account"
              : need2FA
              ? "Verify"
              : "Login"}
          </button>
        </form>

        {/* Google OAuth */}
        {!need2FA && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="text-gray-400 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-600" />
            </div>

            <a
              href={`${backendUrl}/auth/google`}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-full border border-gray-600 text-gray-300 hover:bg-white/5 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>

            {/* <div className="flex justify-center">
  <GoogleLogin
    onSuccess={(res) => handleGoogleLogin(res.credential)}
    onError={() => toast.error("Google login failed")}
    theme="filled_black"
    shape="pill"
    width="320"
  />
</div> */}
          </>
        )}

        {/* Toggle */}
        {!need2FA && (
          state === "Sign Up" ? (
            <p className="text-gray-400 text-center text-xs mt-4">
              Already have an account?{" "}
              <span onClick={() => switchState("Login")} className="cursor-pointer underline" style={{ color: "#39ff14" }}>
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">
              Don't have an account?{" "}
              <span onClick={() => switchState("Sign Up")} className="cursor-pointer underline" style={{ color: "#39ff14" }}>
                Sign up
              </span>
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Login;