import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt="header_img"
        className="w-36 h-36 rounded-full mb-6"
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium">
        {/* ✅ FIX #6: show name from signup, fallback to "Developer" */}
        Hey..{userData ? userData.name || "Developer" : "Developer"}!

      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>
      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time!
      </p>

      {/* ✅ Email not verified warning */}
      {userData && !userData.isEmailVerified && (
        <p
          onClick={() => navigate("/email-verify")}
          className="mb-4 text-sm text-yellow-600 cursor-pointer underline"
        >
          ⚠ Your email is not verified — click here
        </p>
      )}

      <button
        onClick={() => navigate(userData ? (userData.role === "admin" ? "/admin" : "/dashboard") : "/login")}
        className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all"
      >
        {userData ? "Go to Dashboard" : "Get Started"}
      </button>
    </div>
  );
};

export default Header;