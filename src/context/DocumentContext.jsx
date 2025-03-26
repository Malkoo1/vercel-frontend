import React, { createContext, useContext, useState } from 'react';
import { deleteComment, fetchDocument, saveAnnotation, saveComment } from '../services/api2';

const DocumentContext = createContext();

export const useDocument = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
    const [document, setDocument] = useState(null);
    const [annotations, setAnnotations] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDocument = async (documentId) => {
        setLoading(true);
        try {
            const data = await fetchDocument(documentId);
            setDocument(data.document);
            setAnnotations(data.annotations);
            setError(null);
        } catch (err) {
            setError('Failed to load document');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addAnnotation = async (annotation) => {
        try {
            const savedAnnotation = await saveAnnotation(document.id, annotation);
            setAnnotations(prev => [...prev, savedAnnotation]);
            return savedAnnotation;
        } catch (err) {
            setError('Failed to save annotation');
            console.error(err);
            return null;
        }
    };

    const addComment = async (annotationId, comment) => {
        try {
            const savedComment = await saveComment(document.id, annotationId, comment);
            setAnnotations(prev =>
                prev.map(annotation =>
                    annotation.id === annotationId
                        ? { ...annotation, comments: [...(annotation.comments || []), savedComment] }
                        : annotation
                )
            );
            return savedComment;
        } catch (err) {
            setError('Failed to save comment');
            console.error(err);
            return null;
        }
    };

    const removeComment = async (annotationId, commentId) => {
        try {
            await deleteComment(document.id, annotationId, commentId);
            setAnnotations(prev =>
                prev.map(annotation =>
                    annotation.id === annotationId
                        ? {
                            ...annotation,
                            comments: (annotation.comments || []).filter(c => c.id !== commentId)
                        }
                        : annotation
                )
            );
            return true;
        } catch (err) {
            setError('Failed to delete comment');
            console.error(err);
            return false;
        }
    };

    const value = {
        document,
        annotations,
        loading,
        error,
        getDocument,
        addAnnotation,
        addComment,
        removeComment,
        setAnnotations
    };

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    );
};