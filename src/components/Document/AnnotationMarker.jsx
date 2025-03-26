import React from 'react';

const AnnotationMarker = ({ annotation, onClick }) => {
    const getColor = (id) => {
        if (id === 1) return 'bg-orange-500';
        if (id === 2) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div
            className="absolute"
            style={{ top: annotation.y, left: annotation.x }}
            onClick={onClick}
        >
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${getColor(annotation.id)} flex items-center justify-center text-white cursor-pointer shadow-lg text-xs`}>
                {annotation.id}
            </div>
        </div>
    );
};

export default AnnotationMarker;