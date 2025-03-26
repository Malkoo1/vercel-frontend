import React from "react";
import { useFolders } from "../context/FolderContext";

export const UserSubHeader = () => {
  const { selectedFolder, shareDetail } = useFolders();

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{selectedFolder}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map(id => (
                        <div key={id} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                            {id < 5 ? id : `+${id - 4}`}
                        </div>
                    ))}
                </div> */}

        {/* <button onClick={() => setIsPopupInviteOpen(true)} className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button> */}

        {/* File Upload Popup */}
      </div>
    </div>
  );
};
