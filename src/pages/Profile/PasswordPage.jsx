import { Eye, Languages } from "lucide-react";

import React, { useState } from "react";
import { Link } from "react-router-dom";
function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-xl">✱</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>

        <nav className="mt-4">
          <Link
            to="/settings"
            className={`w-full flex items-center px-6 py-3 space-x-3 border-l-4 border-transparent hover:bg-gray-50 `}
          >
            <Languages className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Language</span>
          </Link>

          {/* <Link to="/change-password" className={`w-full flex items-center px-6 py-3 space-x-3 border-l-4 border-[#FD5E4F] bg-coral-100`}
                    >
                        <Lock className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Password</span>
                    </Link> */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div>
          <h2 className="text-xl mb-2">Password</h2>
          <p className="text-gray-500 mb-6">
            Please enter your current password to change your password.
          </p>

          {/* Language Selector */}
          <div className="max-w-xl relative">
            <div className="mb-6">
              <label className="block text-gray-500 mb-2">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full p-3 rounded bg-gray-100 border border-gray-200"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-500 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full p-3 rounded bg-gray-100 border border-gray-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-500 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full p-3 rounded bg-gray-100 border border-gray-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <button className="bg-[#FD5E4F] text-white py-2 px-6 rounded-md hover:bg-[#FD5E4F]">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
