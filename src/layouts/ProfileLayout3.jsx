import React, { useState } from 'react';

// Sidebar component
const Sidebar = ({ activeItem }) => {
    const menuItems = [
        { icon: "💬", text: "Messages" },
        { icon: "👤", text: "Profile" },
        { icon: "⚙️", text: "Settings", active: true }
    ];

    return (
        <div className="w-20 md:w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-400">✻</span>
                </div>
            </div>

            <div className="flex flex-col flex-grow">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-4 ${item.active ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                    >
                        <span className="text-xl mr-3">{item.icon}</span>
                        <span className="hidden md:block text-gray-700">{item.text}</span>
                        {item.active && <div className="w-1 h-8 bg-red-400 absolute right-0"></div>}
                    </div>
                ))}
            </div>

            <div className="mt-auto p-4">
                <div className="flex items-center cursor-pointer">
                    <span className="text-xl mr-3">❓</span>
                    <span className="hidden md:block text-gray-700">Help</span>
                </div>
                <div className="flex items-center mt-4 cursor-pointer">
                    <span className="text-xl mr-3">📦</span>
                    <span className="hidden md:block text-gray-700">Apps</span>
                </div>
                <div className="flex items-center mt-4 cursor-pointer">
                    <span className="text-xl mr-3">🚪</span>
                    <span className="hidden md:block text-gray-700">Logout</span>
                </div>
            </div>
        </div>
    );
};

// Settings sidebar component
const SettingsSidebar = ({ activeItem }) => {
    const menuItems = [
        { icon: "🌐", text: "Language" },
        { icon: "🔒", text: "Password", active: true }
    ];

    return (
        <div className="w-full md:w-64 border-r border-gray-200">
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={`flex items-center p-4 ${item.active ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                </div>
            ))}
        </div>
    );
};

// Password Field Component
const PasswordField = ({ label, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-6">
            <label className="block text-gray-400 mb-2">{label}</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 bg-gray-100 rounded-lg"
                    placeholder={placeholder || "••••••••"}
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
            </div>
        </div>
    );
};

// Main ProfileLayout component
const ProfileLayout = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            {/* Main Sidebar */}
            <Sidebar activeItem="settings" />

            <div className="flex-grow flex flex-col md:flex-row">
                {/* Settings Sidebar */}
                <SettingsSidebar activeItem="password" />

                {/* Content Area */}
                <div className="flex-grow p-6">
                    <h1 className="text-2xl font-medium text-gray-800 mb-6">Settings</h1>

                    <div className="max-w-lg">
                        <h2 className="text-xl text-gray-700 mb-2">Password</h2>
                        <p className="text-gray-500 mb-6">Please enter your current password to change your password.</p>

                        <form>
                            <PasswordField label="Current password" />
                            <PasswordField label="New Password" />
                            <PasswordField label="Confirm New Password" />

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;