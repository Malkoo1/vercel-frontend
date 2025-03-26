// src/components/AnnotationMarker.js
import React from 'react';

const AnnotationMarker = ({ annotation, onClick }) => {
    return (
        <div
            className="absolute"
            style={{ top: annotation.y, left: annotation.x }}
            onClick={onClick}
        >
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${annotation.id % 3 === 1 ? 'bg-orange-500' :
                annotation.id % 3 === 2 ? 'bg-blue-500' : 'bg-green-500'
                } flex items-center justify-center text-white cursor-pointer shadow-lg text-xs`}>
                {annotation.id}
            </div>
        </div>
    );
};

export default AnnotationMarker;