// src/components/DocumentTitleBar.js
import { MessageSquare } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { AnnotationsContext } from '../../context/AnnotationsContext';

const DocumentTitleBar = ({ onToggleSidebar }) => {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const { annotations } = useContext(AnnotationsContext);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const participantAvatars = annotations ? annotations.reduce((acc, annotation) => {
        annotation.comments.forEach(comment => {
            if (!acc.find(p => p.avatar === comment.avatar)) {
                acc.push({ avatar: comment.avatar, avatarColor: comment.avatarColor });
            }
        });
        return acc;
    }, []) : [];

    const initialAnnotationsCount = annotations ? annotations.length : 0; // Count of annotations

    return (
        <div className="bg-white py-2 px-2 sm:px-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center truncate">
                <span className="mr-2">#</span>
                <h2 className="font-medium text-sm sm:text-base truncate">Seeds Design Session Optimierung von Prompts für KI (1).pdf</h2>
            </div>

            <div className="flex items-center">
                <div className="flex -space-x-2 mr-2 sm:mr-4">
                    {participantAvatars.slice(0, 3).map((participant, index) => (
                        <div key={index} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${participant.avatarColor} border-2 border-white flex items-center justify-center text-white text-xs`}>
                            {participant.avatar}
                        </div>
                    ))}
                    {participantAvatars.length > 3 && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs">
                            +{participantAvatars.length - 3}
                        </div>
                    )}
                    {initialAnnotationsCount > participantAvatars.length && participantAvatars.length <= 3 && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs">
                            +{initialAnnotationsCount - participantAvatars.length}
                        </div>
                    )}
                </div>

                {windowWidth >= 640 && (
                    <button className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                        <span>Add Participant</span>
                    </button>
                )}

                {windowWidth < 768 && (
                    <button
                        onClick={onToggleSidebar}
                        className="ml-2 p-2 border rounded-full"
                    >
                        <MessageSquare size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DocumentTitleBar;