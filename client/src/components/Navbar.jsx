import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, isLoggedin, logout } = useContext(AppContext);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
    <span className="text-4xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate("/")}>
  auth<span style={{ color: "#39ff14" }}>.</span>
</span>

      {isLoggedin && userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer select-none">
          {userData.name
            ? userData.name[0].toUpperCase()
            : userData.email[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm min-w-[150px] shadow-lg rounded-md">
              <li
                onClick={() =>
                  navigate(userData.role === "admin" ? "/admin" : "/dashboard")
                }
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                {userData.role === "admin" ? "Admin Panel" : "Dashboard"}
              </li>

              {/* Show verify email option only if not verified */}
              {!userData.isEmailVerified && (
                <li
                  onClick={() => navigate("/email-verify")}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer text-yellow-600"
                >
                  Verify email
                </li>
              )}

              <li
                onClick={handleLogout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;