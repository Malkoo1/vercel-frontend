import { Check, Download, MessageSquare, Share, X } from 'lucide-react';
import React from 'react';

const DocumentMobileMenu = ({ toggleMobileMenu, toggleSidebar }) => {
    return (
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
                <button className="p-2 flex flex-col items-center justify-center border rounded" onClick={toggleSidebar}>
                    <MessageSquare size={20} />
                    <span className="text-xs mt-1">Comments</span>
                </button>
            </div>
            <button onClick={toggleMobileMenu} className="mt-4 w-full py-2 border rounded flex justify-center">
                <X size={16} className="mr-2" /> Close Menu
            </button>
        </div>
    );
};

export default DocumentMobileMenu;