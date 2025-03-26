// src/store/AnnotationsContext.js
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { deleteComment, fetchDocument, saveAnnotation, saveComment } from '../services/api2';

export const AnnotationsContext = createContext();

export const AnnotationsProvider = ({ children }) => {
    const [annotations, setAnnotations] = useState();
    const [activeAnnotation, setActiveAnnotation] = useState(null);
    const [nextAnnotationId, setNextAnnotationId] = useState(3); // Consider how IDs are handled by the API
    const [currentUser] = useState({ // In a real app, get this from authentication
        name: "Current User",
        avatar: "U",
        avatarColor: "bg-green-500"
    });
    const documentId = '41'; // Hardcoded for now, will likely come from props or route params

    const fetchInitialData = useCallback(async () => {
        try {
            const data = await fetchDocument(documentId);
            if (data && data.annotations) {
                setAnnotations(data.annotations);
                // Update nextAnnotationId based on the fetched data if needed
                if (data.annotations.length > 0) {
                    const maxId = Math.max(...data.annotations.map(a => a.id), 0);
                    setNextAnnotationId(maxId + 1);
                } else {
                    setNextAnnotationId(1);
                }
            }
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        }
    }, [documentId]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);



    const handleAddAnnotation = async (x, y) => {
        try {
            const newAnnotation = { x, y, comments: [] };
            const savedAnnotation = await saveAnnotation(documentId, newAnnotation);
            setAnnotations(prevAnnotations => [...prevAnnotations, savedAnnotation]);
            setActiveAnnotation(savedAnnotation);
        } catch (error) {
            console.error("Error adding annotation:", error);
        }
    };

    const handleAddCommentToAnnotation = async (annotationId, text) => {
        try {
            const newComment = { text, user: currentUser.name, avatar: currentUser.avatar, avatarColor: currentUser.avatarColor };
            const savedComment = await saveComment(documentId, annotationId, newComment);
            setAnnotations(prevAnnotations =>
                prevAnnotations.map(annotation =>
                    annotation.id === annotationId
                        ? { ...annotation, comments: [...annotation.comments, savedComment] }
                        : annotation
                )
            );
            // Update active annotation if it's the one being commented on
            if (activeAnnotation && activeAnnotation.id === annotationId) {
                setActiveAnnotation(annotations.find(a => a.id === annotationId)); // Use the current 'annotations' state
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };


    const handleEditComment = async (annotationId, commentId, text) => {
        try {
            const updatedCommentData = { text };
            const updatedAnnotations = annotations.map(annotation => {
                if (annotation.id === annotationId) {
                    return {
                        ...annotation,
                        comments: annotation.comments.map(comment =>
                            comment.id === commentId ? { ...comment, ...updatedCommentData, edited: true, time: "Edited just now" } : comment
                        ),
                    };
                }
                return annotation;
            });
            setAnnotations(updatedAnnotations);
            // No explicit API call for edit in the provided dummy data, assuming direct update is sufficient for now.
            // In a real scenario, you'd call saveComment or a dedicated editComment API.

            // Update active annotation if it's the one being edited
            if (activeAnnotation && activeAnnotation.id === annotationId) {
                setActiveAnnotation(updatedAnnotations.find(a => a.id === annotationId));
            }
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };



    const handleDeleteComment = async (annotationId, commentId) => {
        try {
            await deleteComment(documentId, annotationId, commentId);
            setAnnotations(prevAnnotations =>
                prevAnnotations.map(annotation => ({
                    ...annotation,
                    comments: annotation.comments.filter(comment => comment.id !== commentId),
                }))
            );
            // Update active annotation if it's the one being deleted from
            if (activeAnnotation && activeAnnotation.id === annotationId) {
                setActiveAnnotation(prevAnnotations => prevAnnotations.find(a => a.id === annotationId));
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <AnnotationsContext.Provider
            value={{
                annotations,
                activeAnnotation,
                currentUser,
                setActiveAnnotation,
                handleAddAnnotation,
                handleAddCommentToAnnotation,
                handleEditComment,
                handleDeleteComment,
            }}
        >
            {children}
        </AnnotationsContext.Provider>
    );
};