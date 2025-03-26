import { Bell, ChevronDown, ChevronLeft, FolderCode, HelpCircle, Info, LogOut, MessageCircle, Settings, User, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function ProfileLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex md:w-64 flex-col bg-white border-r flex-shrink-0`}>
                <div className="p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-400 text-xl">★</span>
                    </div>
                </div>

                <nav className="flex-1 mt-5 px-2">
                    <Link
                        to="/projects"
                        className={`flex items-center p-3 rounded-md mb-1 ${isActive('projects') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FolderCode className="w-5 h-5 mr-3" />
                        <span>Projects</span>
                    </Link>

                    <Link
                        to="/team"
                        className={`flex items-center p-3 rounded-md mb-1 ${isActive('team') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Users className="w-5 h-5 mr-3" />
                        <span>Team</span>
                    </Link>

                    <Link
                        to="/settings"
                        className={`flex items-center p-3 rounded-md mb-1 ${isActive('settings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Settings className="w-5 h-5 mr-3" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <Link
                        to="/about"
                        className={`flex items-center p-3 rounded-md mb-1 ${isActive('about') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Info className="w-5 h-5 mr-3" />
                        <span>About</span>
                    </Link>

                    <Link
                        to="/logout"
                        className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden fixed z-50 top-4 left-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md bg-white shadow-md"
                >
                    {isMobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white">
                    <div className="p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-400 text-xl">★</span>
                        </div>
                    </div>

                    <nav className="px-4 py-2">
                        <Link
                            to="/messages"
                            className={`flex items-center p-3 mb-2 rounded-md ${isActive('messages') ? 'text-blue-600' : 'text-gray-600'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <MessageCircle className="w-5 h-5 mr-3" />
                            <span>Messages</span>
                        </Link>

                        <Link
                            to="/profile"
                            className={`flex items-center p-3 mb-2 rounded-md ${isActive('profile') ? 'text-blue-600' : 'text-gray-600'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <User className="w-5 h-5 mr-3" />
                            <span>Profile</span>
                        </Link>

                        <Link
                            to="/settings"
                            className={`flex items-center p-3 mb-2 rounded-md ${isActive('settings') ? 'text-blue-600' : 'text-gray-600'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Settings className="w-5 h-5 mr-3" />
                            <span>Settings</span>
                        </Link>

                        <Link
                            to="/notifications"
                            className={`flex items-center p-3 mb-2 rounded-md ${isActive('notifications') ? 'text-blue-600' : 'text-gray-600'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Bell className="w-5 h-5 mr-3" />
                            <span>Notifications</span>
                        </Link>

                        <Link
                            to="/faqs"
                            className={`flex items-center p-3 mb-2 rounded-md ${isActive('faqs') ? 'text-blue-600' : 'text-gray-600'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <HelpCircle className="w-5 h-5 mr-3" />
                            <span>FAQs</span>
                        </Link>

                        <Link
                            to="/logout"
                            className="flex items-center p-3 text-gray-600 rounded-md mt-8"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </Link>
                    </nav>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white border-b flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <button className="p-2 mr-2 rounded-full bg-red-100 text-red-500">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold">Notification</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1 border rounded-md">
                            <span className="mr-2">Sort By</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex items-center px-3 py-1 border rounded-md">
                            <span className="mr-2">Filter</span>
                        </button>
                    </div>
                </header>
                <Outlet />
            </div>
        </div>
    );
}

export default ProfileLayout;