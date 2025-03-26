import { ArrowLeft, Check, Download, Menu, MoreHorizontal, Share } from 'lucide-react';
import React from 'react';

const DocumentHeader = ({ document, windowWidth, toggleMobileMenu }) => {
    return (
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
                <h1 className="font-bold text-sm sm:text-base truncate">{document.title}</h1>
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
    );
};

export default DocumentHeader;