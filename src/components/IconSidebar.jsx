import { FolderCode, Info, LogOut, Settings, Users } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const IconSidebar = ({ isMobileMenuOpen }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken"); // Remove token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div
      className={`${
        isMobileMenuOpen ? "block" : "hidden"
      } relative w-16 h-screen md:block w-20 bg-white border-r border-gray-200 flex-shrink-0`}
    >
      <div className="h-screen flex flex-col items-center py-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8">
          <img
            src="/circle_logo.png"
            alt="SATO studio"
            className="w-12 h-12 rounded-lg"
          />
        </div>

        <nav className="flex-1 flex flex-col items-center space-y-6">
          <Link
            to="/dashboard"
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              location.pathname === "/dashboard"
                ? "bg-coral-100 text-coral-500"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <FolderCode className="w-6 h-6" />
          </Link>

          <Link
            to="/users"
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              location.pathname === "/users"
                ? "bg-coral-100 text-coral-500"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <Users className="w-6 h-6" />
          </Link>

          <Link
            to="/settings"
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              location.pathname === "/settings"
                ? "bg-coral-100 text-coral-500"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <Settings className="w-6 h-6" />
          </Link>
        </nav>

        <div className="flex flex-col items-center space-y-4">
          <Link
            to="/info"
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              location.pathname === "/info"
                ? "bg-coral-100 text-coral-500"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <Info className="w-6 h-6" />
          </Link>

          <button
            onClick={() => setShowLogoutDialog(true)} // Call logout function
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-400"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-modal-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 text-gray-600 cursor-pointer hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutDialog(false);
                }}
                className="px-4 py-2 bg-[#FD5E4F] text-white hover:bg-[#e01e0cf2] rounded-lg cursor-pointer font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
