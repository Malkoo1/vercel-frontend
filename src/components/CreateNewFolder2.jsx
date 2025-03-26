import React, { useEffect, useState } from 'react';
import { createFolder, updateFolder } from '../services/api'; // Import both API functions

const CreateNewFolder = ({ isOpen, onClose, onFolderCreated, folder, SelectedFolder }) => { // Renamed onFolderCreated to onFolderChange, added folder prop
    const [folderName, setFolderName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (folder) {
            setFolderName(folder.name); // Pre-fill folder name if in update mode
        } else {
            setFolderName(''); // Clear folder name if in create mode or modal is opened fresh
        }
        setErrorMessage(''); // Clear error message on modal open/mode change
    }, [folder, isOpen]); // Update folderName when 'folder' prop changes or modal opens

    const handleSubmit = async () => {
        if (!folderName.trim()) {
            setErrorMessage('Folder name cannot be empty.');
            return;
        }
        setErrorMessage('');

        try {
            let updatedFolder;
            const folderData = { name: folderName };

            if (folder) {
                // Update existing folder
                updatedFolder = await updateFolder(folder._id, folderData);
                console.log('Folder updated successfully:', updatedFolder);
            } else {
                // Create new folder
                updatedFolder = await createFolder(folderData);
                console.log('Folder created successfully:', updatedFolder);
            }

            onClose();
            setFolderName('');
            if (onFolderCreated) {
                onFolderCreated(updatedFolder); // Notify parent about folder change (create or update)
                SelectedFolder(updatedFolder._id); // Select the created/updated folder
            }
            // Optionally: Success message
        } catch (error) {
            console.error(folder ? 'Error updating folder:' : 'Error creating folder:', error);
            setErrorMessage(error || (folder ? 'Failed to update folder.' : 'Failed to create folder.'));
        }
    };

    if (!isOpen) return null;

    const modalTitle = folder ? 'Update Folder Name' : 'Create New Folder'; // Conditional title
    const submitButtonText = folder ? 'Update' : 'Continue'; // Conditional button text

    return (
        <div className="fixed inset-0 bg-modal-200 bg-opacity-30 flex items-center justify-center z-50">
            {/* Popup Content */}
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gray-200 p-4 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{modalTitle}</h2> {/* Conditional Title */}
                    <p className="text-gray-500 text-sm mt-1">Start create and manage your project by few clicks!</p>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Folder Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-400"
                        value={folderName}
                        onChange={(e) => { setFolderName(e.target.value); setErrorMessage(''); }} // Clear error on input change
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                        {submitButtonText} {/* Conditional Button Text */}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white hover:bg-gray-100 text-gray-800 py-3 px-4 border border-gray-300 rounded-lg transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewFolder;