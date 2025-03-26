import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchDocument = async (fileId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/file/document/${fileId}`);
        return response.data; // Assuming the API response contains `{ document, annotations }`
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const saveAnnotation = async (documentId, annotation) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/file/document/${documentId}/annotations`,
            {
                x: annotation.x,
                y: annotation.y,
                comments: annotation.comments // Send comments if any
            }
        );
        return response.data; // The backend will return the saved annotation with its new ID
    } catch (error) {
        console.error('Failed to save annotation:', error);
        throw error.response ? error.response.data : error.message;
    }
};



export const saveComment = async (documentId, annotationId, comment) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/file/document/${documentId}/annotations/${annotationId}/comments`,
            {
                text: comment.text,
                userId: comment.userId,       // Add userId to the request body
                guestName: comment.guestName,  // Add guestName to the request body
                avatar: comment.avatar,
                avatarColor: comment.avatarColor,
            }
        );
        return response.data; // The backend will return the saved comment with its new ID and time
    } catch (error) {
        console.error('Failed to save comment:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const deleteComment = async (documentId, annotationId, commentId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/file/document/${documentId}/annotations/${annotationId}/comments/${commentId}`
        );
        return response.data; // The backend will return a success message
    } catch (error) {
        console.error('Failed to delete comment:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const updateComment = async (documentId, annotationId, commentId, text) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/file/document/${documentId}/annotations/${annotationId}/comments/${commentId}`,
            {
                text: text
            }
        );
        return response.data; // The backend will return the updated comment
    } catch (error) {
        console.error('Failed to update comment:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const approveDocument = async (documentId, approvalData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/file/documents/${documentId}/approve`, approvalData);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error saving approval:', error);
        throw error; // Throw the error so it can be handled by the calling function
    }
};

export const revokeApproval = async (documentId, approvalData) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/file/documents/${documentId}/revoke`,
            { data: approvalData } // Send data in the correct format
        );
        return response.data;
    } catch (error) {
        console.error('Error revoking approval:', error);
        throw error;
    }
};