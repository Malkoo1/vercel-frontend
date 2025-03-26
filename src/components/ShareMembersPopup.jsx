import React, { useState } from 'react';

const ShareMembersPopup = ({ isOpen, onClose }) => {
    const [emailInputs, setEmailInputs] = useState(['', '', '']);

    const handleEmailChange = (index, value) => {
        const newEmailInputs = [...emailInputs];
        newEmailInputs[index] = value;
        setEmailInputs(newEmailInputs);
    };

    const addNewEmailField = () => {
        setEmailInputs([...emailInputs, '']);
    };

    const deleteEmailField = (index) => {
        if (emailInputs.length > 1) {
            setEmailInputs(emailInputs.filter((_, i) => i !== index));
        } else {
            setEmailInputs(['']);
        }
    };

    const handleSubmit = () => {
        const validEmails = emailInputs.filter(email => email.trim() !== '');
        console.log('Inviting members:', validEmails);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-modal-200 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gray-200 p-4 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Invite Your Members</h2>
                    <p className="text-gray-500 text-sm mt-1">Start creating and managing your project in a few clicks!</p>
                </div>

                <div className="mb-6 space-y-4">
                    {emailInputs.map((email, index) => (
                        <div key={index} className="relative flex items-center gap-2">
                            <input
                                type="email"
                                placeholder="Enter member email address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-400"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                            />
                            <button
                                onClick={() => deleteEmailField(index)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                                aria-label="Delete email field"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addNewEmailField}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-300 mt-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add new member
                    </button>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                        Continue
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

export default ShareMembersPopup;
