import { MessageSquare } from 'lucide-react';
import React from 'react';

const DocumentToolbar = ({ document, windowWidth, toggleSidebar, showSidebar }) => {
    return (
        <div className="bg-white py-2 px-2 sm:px-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center truncate">
                <span className="mr-2">#</span>
                <h2 className="font-medium text-sm sm:text-base truncate">{document.title}</h2>
            </div>

            <div className="flex items-center">
                <div className="flex -space-x-2 mr-2 sm:mr-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-xs">C</div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">A</div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs">+3</div>
                </div>

                {windowWidth >= 640 && (
                    <button className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                        <span>Add Participant</span>
                    </button>
                )}

                {windowWidth < 768 && (
                    <button
                        onClick={toggleSidebar}
                        className="ml-2 p-2 border rounded-full"
                    >
                        <MessageSquare size={16} className={showSidebar ? "text-red-500" : "text-gray-500"} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DocumentToolbar;