import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { userData, authAxios, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  // ✅ FIX #9: only 2 tabs — profile & security (tokens tab removed)
  const [tab, setTab] = useState("profile");

  // 2FA state
  const [twoFAData, setTwoFAData] = useState(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [loading, setLoading] = useState(false);

  // ── 2FA Setup ──────────────────────────────────────────────────────────────
  const setup2FA = async () => {
    setLoading(true);
    try {
      // ✅ FIX #8: authAxios already has the Bearer token in its interceptor
      const { data } = await authAxios.post("/auth/2fa/setup");
      setTwoFAData(data);
      toast.info("Scan the QR code with your authenticator app");
    } catch (error) {
      toast.error(error.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  // ── 2FA Verify + Enable ────────────────────────────────────────────────────
  const verify2FA = async () => {
    if (twoFACode.length !== 6) {
      toast.error("Enter a 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAxios.post("/auth/2fa/verify", { code: twoFACode });
      toast.success(data.message || "2FA enabled!");
      setUserData((prev) => ({ ...prev, twoFactorEnabled: true }));
      setTwoFAData(null);
      setTwoFACode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  console.log(userData)
  // ✅ FIX #7: show name in dashboard — userData.name now always populated
  const displayName = userData.name || userData.email.split("@")[0];

  return (
    <div
      className="flex flex-col min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center"
    >
      <Navbar />

      <div className="max-w-3xl mx-auto w-full px-4 pt-24 pb-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Hey, <span style={{ color: "#39ff14" }}>{displayName}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account settings</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          {["profile", "security"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm capitalize transition-colors ${
                tab === t
                  ? "border-b-2 font-medium -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              style={tab === t ? { color: "#39ff14", borderBottomColor: "#39ff14" } : {}}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab === "profile" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Name", value: userData.name || "—" }, 
              { label: "Email", value: userData.email },
              {
                label: "Role",
                value: (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium border"
                    style={{
                      background: "rgba(57,255,20,0.1)",
                      color: "#39ff14",
                      borderColor: "rgba(57,255,20,0.3)",
                    }}
                  >
                    {userData.role}
                  </span>
                ),
              },
              {
                label: "Email Status",
                value: userData.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-sm" style={{ color: "#39ff14" }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#39ff14" }} />
                    Verified
                  </span>
                ) : (
                  <span
                    onClick={() => navigate("/email-verify")}
                    className="flex items-center gap-1 text-sm cursor-pointer text-yellow-500"
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                    Not verified (click to verify)
                  </span>
                ),
              },
              {
                label: "Two-Factor Auth",
                value: userData.twoFactorEnabled ? (
                  <span style={{ color: "#39ff14" }}>Enabled</span>
                ) : (
                  <span className="text-gray-400">Disabled</span>
                ),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="text-gray-800 text-sm">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Security Tab ── */}
        {tab === "security" && (
          <div className="space-y-4">
            {/* Change Password */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <h3 className="text-gray-800 font-medium mb-1">Change Password</h3>
              <p className="text-gray-400 text-xs mb-4">
                Use the forgot password flow to set a new password. A reset link will be emailed to you.
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="px-5 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Request Password Reset
              </button>
            </div>

            {/* 2FA Setup */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <h3 className="text-gray-800 font-medium mb-1">Two-Factor Authentication</h3>
              <p className="text-gray-400 text-xs mb-4">
                {userData.twoFactorEnabled
                  ? "2FA is currently enabled on your account."
                  : "Add an extra layer of security using an authenticator app like Google Authenticator or Authy."}
              </p>

              {userData.twoFactorEnabled && (
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "#39ff14" }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#39ff14" }} />
                  2FA is active
                </div>
              )}

              {!userData.twoFactorEnabled && !twoFAData && (
                <button
                  onClick={setup2FA}
                  disabled={loading}
                  className="px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50"
                  style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
                >
                  {loading ? "Setting up..." : "Setup 2FA"}
                </button>
              )}

              {/* QR code + secret + verify input */}
              {twoFAData && (
                <div className="mt-2 space-y-3">
                  <p className="text-gray-500 text-xs">
                    1. Scan this QR code with your authenticator app:
                  </p>
                  <div className="bg-white p-3 rounded-lg inline-block border border-gray-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        twoFAData.otpAuthUrl
                      )}`}
                      width={160}
                      height={160}
                      alt="2FA QR Code"
                    />
                  </div>
                  <p className="text-gray-500 text-xs">Or enter this secret manually:</p>
                  <div className="bg-gray-100 rounded px-3 py-2 text-xs font-mono break-all text-gray-700 border border-gray-200">
                    {twoFAData.secret}
                  </div>
                  <p className="text-gray-500 text-xs">
                    2. Enter the 6-digit code from your app to confirm:
                  </p>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                      className="w-36 px-4 py-2 text-center text-lg rounded-full outline-none tracking-widest border border-gray-300 bg-white text-gray-800 focus:border-green-400"
                    />
                    <button
                      onClick={verify2FA}
                      disabled={loading || twoFACode.length < 6}
                      className="px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50"
                      style={{ background: "linear-gradient(to right, #39ff14, #00cc00)", color: "#000" }}
                    >
                      {loading ? "Verifying..." : "Verify & Enable"}
                    </button>
                  </div>
                  <button
                    onClick={() => { setTwoFAData(null); setTwoFACode(""); }}
                    className="text-gray-400 text-xs hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;