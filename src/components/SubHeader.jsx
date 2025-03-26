import React, { useState } from 'react';
import { useFolders } from '../context/FolderContext';
import FileUploadPopup from './FileUploadPopup';
import ShareMembersPopup from './ShareMembersPopup';

export const SubHeader = () => {

    const { selectedFolder, shareDetail } = useFolders();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupInviteOpen, setIsPopupInviteOpen] = useState(false);


    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const uploadButtonStyles = {
        base: "px-4 py-2 text-white rounded-lg flex items-center",
        enabled: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
        disabled: "bg-gray-400 cursor-not-allowed",
    };

    return (
        <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">{selectedFolder}</h1>
                {/* <button className="ml-2 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button> */}
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


                {!shareDetail && (
                    <button
                        onClick={openPopup}
                        className={`${uploadButtonStyles.base} ${selectedFolder ? uploadButtonStyles.enabled : uploadButtonStyles.disabled
                            }`}
                        disabled={!selectedFolder}
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Upload New File</span>
                    </button>
                )}

                {/* File Upload Popup */}
                <FileUploadPopup isOpen={isPopupOpen} onClose={closePopup} />
            </div>
            <ShareMembersPopup isOpen={isPopupInviteOpen} onClose={() => setIsPopupInviteOpen(false)} />
        </div>

    );
};

