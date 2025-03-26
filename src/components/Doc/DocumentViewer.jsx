// src/components/DocumentViewer.js
import React, { useContext, useEffect, useState } from 'react';
import { AnnotationsContext } from '../../context/AnnotationsContext';
import { fetchDocument } from '../../services/api2';
import AnnotationMarker from './AnnotationMarker';


const DocumentViewer = ({ handleAnnotationClick }) => {
    const { annotations, handleAddAnnotation } = useContext(AnnotationsContext);
    const [documentContent, setDocumentContent] = useState(null);
    const documentId = '41'; // Hardcoded for now

    useEffect(() => {
        const loadDocument = async () => {
            try {
                const data = await fetchDocument(documentId);
                setDocumentContent(data.document);
            } catch (error) {
                console.error("Error loading document content:", error);
            }
        };

        loadDocument();
    }, [documentId]);

    const handleDocumentDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleAddAnnotation(x, y);
    };



    if (!documentContent) {
        return <div>Loading document...</div>; // Basic loading state
    }

    return (
        <div
            className="bg-white p-4 sm:p-6 rounded shadow-sm mx-auto max-w-3xl relative"
            onDoubleClick={handleDocumentDoubleClick}
            style={{ minHeight: "600px" }}
        >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{documentContent.content.heading}</h2>

            <ul className="space-y-4 mb-6">
                {documentContent.content.bulletPoints.map((point, index) => (
                    <li key={index} className="flex gap-2">
                        <span>•</span>
                        <p>{point}</p>
                    </li>
                ))}
            </ul>

            {/* Annotation Markers */}
            {annotations.map((annotation) => (
                <AnnotationMarker
                    key={annotation.id}
                    annotation={annotation}
                    onClick={() => handleAnnotationClick(annotation)}
                />
            ))}
        </div>
    );
};

export default DocumentViewer;