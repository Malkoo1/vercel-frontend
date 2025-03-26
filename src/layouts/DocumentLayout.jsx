// src/layouts/DocumentLayout.js
import { ArrowLeft, Check, Download, Menu, MoreHorizontal, Share, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { AnnotationsProvider } from '../context/AnnotationsContext';
const DocumentLayout = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },);

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <AnnotationsProvider>
            <div className="flex flex-col h-screen bg-gray-100">
                {/* Header - Responsive */}
                <header className="bg-white border-b border-gray-200 flex items-center px-2 sm:px-4 py-2">
                    <button className="p-2 rounded-full bg-red-100 text-red-500 mr-2 sm:mr-4">
                        <ArrowLeft size={20} />
                    </button>

                    {windowWidth < 640 ? (
                        <button onClick={toggleMobileMenu} className="p-2 mr-2">
                            <Menu size={20} />
                        </button>
                    ) : (
                        <div className="bg-gray-200 rounded-full p-2 mr-4">
                            <div className="text-red-500 font-bold">S</div>
                        </div>
                    )}

                    <div className="flex-1 truncate">
                        <h1 className="font-bold text-sm sm:text-base truncate">Seeds Design Session Optimierung von Prompts für KI (1).pdf</h1>
                        <p className="text-gray-500 text-xs sm:text-sm truncate">"Hey team great to get started on this!" <Check size={12} className="inline text-gray-400" /></p>
                    </div>

                    {windowWidth >= 640 ? (
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full border border-gray-200">
                                <Share size={20} />
                            </button>
                            <button className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                                <Check size={16} />
                                <span className="hidden sm:inline">Approved</span>
                            </button>
                            <button className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                                <Download size={16} />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                            <button className="p-2 rounded-full border border-gray-200">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    ) : (
                        <button className="p-2 rounded-full border border-gray-200">
                            <MoreHorizontal size={20} />
                        </button>
                    )}
                </header>

                {/* Mobile Menu */}
                {showMobileMenu && windowWidth < 640 && (
                    <div className="bg-white border-b border-gray-200 p-4">
                        <div className="grid grid-cols-3 gap-2">
                            <button className="p-2 flex flex-col items-center justify-center border rounded">
                                <Share size={20} />
                                <span className="text-xs mt-1">Share</span>
                            </button>
                            <button className="p-2 flex flex-col items-center justify-center border rounded bg-red-500 text-white">
                                <Check size={20} />
                                <span className="text-xs mt-1">Approve</span>
                            </button>
                            <button className="p-2 flex flex-col items-center justify-center border rounded bg-red-500 text-white">
                                <Download size={20} />
                                <span className="text-xs mt-1">Export</span>
                            </button>
                            {/* Sidebar toggle will be in the main content area */}
                        </div>
                        <button onClick={toggleMobileMenu} className="mt-4 w-full py-2 border rounded flex justify-center">
                            <X size={16} className="mr-2" /> Close Menu
                        </button>
                    </div>
                )}

                <Outlet />
            </div>
        </AnnotationsProvider>
    );
};

export default DocumentLayout;