import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const loginUser = async (userData) => { // New loginUser API function
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
        if (response.data.token) {
            const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
            sessionStorage.setItem("accessToken", response.data.token);
            sessionStorage.setItem("tokenExpiry", expiryTime);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const fetchUserData = async () => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.user;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const updateUserProfile = async (formData) => {
    try {
        const token = sessionStorage.getItem("accessToken"); // Assuming you store the token in local storage
        const response = await axios.put(`${API_BASE_URL}/auth/me`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Important for file uploads
            },
        });
        return { success: true, user: response.data.user };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

// Folder API calls - Protected Routes

const createFolder = async (folderData) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");
        const response = await axios.post(`${API_BASE_URL}/api/folders`, folderData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const listFoldersForUser = async () => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");
        const response = await axios.get(`${API_BASE_URL}/api/folders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const getFolderById = async (folderId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");
        const response = await axios.get(`${API_BASE_URL}/api/${folderId}`, { // Corrected path to include folderId
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const getFolderShareById = async (folderId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");
        const response = await axios.get(`${API_BASE_URL}/api/share/${folderId}`, { // Corrected path to include folderId
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const updateFolder = async (folderId, folderData) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");
        const response = await axios.patch(`${API_BASE_URL}/api/${folderId}`, folderData, { // Corrected path to include folderId
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const deleteFolder = async (folderId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");
        const response = await axios.delete(`${API_BASE_URL}/api/${folderId}`, { // Corrected path to include folderId
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// files route function
const uploadMultipleFiles = async (files, folderId, description) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('folderId', folderId);
        formData.append('description', description);

        const response = await axios.post(`${API_BASE_URL}/file/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Delete File (Admin Only)
const deleteFile = async (fileId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.delete(`${API_BASE_URL}/file/admin/${fileId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// List Files for Authenticated User
const listFilesForUser = async () => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.get(`${API_BASE_URL}/user-files`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Get File Metadata (Public)
const getFileMetadata = async (fileId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${fileId}/metadata`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Add Comment to File (Public)
const addCommentToFile = async (fileId, commentText, guestName = null) => {
    try {
        const payload = { text: commentText };
        if (guestName) payload.guestName = guestName;

        const response = await axios.post(`${API_BASE_URL}/${fileId}/comments`, payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Get Comments for File (Public)
const getCommentsForFile = async (fileId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${fileId}/comments`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Delete Comment (Admin Only)
const deleteComment = async (fileId, commentId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.delete(`${API_BASE_URL}/${fileId}/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Update File Metadata
const updateFileDescription = async (fileId, description) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.patch(`${API_BASE_URL}/file/${fileId}`, { description }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Add Reply to Comment
const addReplyToComment = async (fileId, commentId, replyText, guestName = null) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const payload = { text: replyText };
        if (guestName) payload.guestName = guestName;

        const response = await axios.post(`${API_BASE_URL}/api/${fileId}/comments/${commentId}/replies`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Download File
const downloadFile = async (fileId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.get(`${API_BASE_URL}/${fileId}/download`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', // Important for file downloads
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Search Files for User
const searchFilesForUser = async (searchQuery) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.get(`${API_BASE_URL}/user-files/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: searchQuery },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Move File to Folder
const moveFileToFolder = async (fileId, newFolderId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.patch(`${API_BASE_URL}/${fileId}/move`, { folderId: newFolderId }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// Get File Versions (Public)
const getFileVersions = async (fileId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${fileId}/versions`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

const uploadFileVersions = async (fileId, files) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            throw new Error("Unauthorized: No token provided");
        }

        if (!files || files.length === 0) {
            throw new Error("No files selected for upload."); // Client-side validation
        }

        const formData = new FormData();
        formData.append('fileId', fileId); // As per backend, fileId is expected in req.body
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]); // 'files' is the key expected by multer array middleware
        }

        const response = await axios.post(`${API_BASE_URL}/file/${fileId}/upload`, formData, { // fileId in the URL path as defined in router
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Explicitly set, though Axios usually handles this with FormData. Good practice to include.
            },
        });

        return response.data; // Return the data from the successful response
    } catch (error) {
        // Handle errors similar to moveFileToFolder, throw user-friendly message or full error
        throw error.response ? error.response.data : error.message;
    }
};

export const fetchSharedFileEmails = async (fileId, type) => {
    try {
        const response = await fetch(`${API_BASE_URL}/file/${type}/${fileId}/emails`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to fetch shared emails:', errorData.message || 'An error occurred');
            return []; // Always return an array on error
        }

        const data = await response.json();

        return data.emails || []; // Ensure it returns an array

    } catch (error) {
        console.error('Error fetching shared emails:', error);
        return []; // Always return an empty array on error
    }
};

export const removeSharedAccess = async ({ resourceType, resourceId, email }) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.delete(`${API_BASE_URL}/file/share`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: { resourceType, resourceId, email }, // ✅ Send email in body (not query param)
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const shareResource = async (shareData) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.post(`${API_BASE_URL}/file/share`, shareData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Ensure Content-Type is set for POST requests with data
            },
        });

        return response.data; // ✅ Return successful response

    } catch (error) {
        // ✅ Extract specific error messages
        let errorMessage = "An error occurred while sharing the file.";

        if (error.response) {
            if (error.response.data && error.response.data.details) {
                // ✅ Display detailed error messages
                errorMessage = `Failed to share with some users: ${error.response.data.details.join(", ")}`;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        } else {
            errorMessage = error.message;
        }

        throw new Error(errorMessage); // ✅ Throw formatted error message
    }
};

export const resolveAnnotationApi = async (fileId, annotationId) => {
    try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await axios.put(`${API_BASE_URL}/file/${fileId}/annotations/${annotationId}/resolve`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        console.log('Annotation resolved:', response.data.annotation);

        return response.data.annotation; // Return resolved annotation if needed
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const generatePDF = async (htmlContent) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: htmlContent }),
        });

        // Check for HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to generate PDF');
        }

        // Verify response is PDF
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
            throw new Error('Server did not return a valid PDF');
        }

        const blob = await response.blob();

        // Verify blob is valid
        if (blob.size === 0) {
            throw new Error('Empty PDF received');
        }

        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    }
};

export const verifyEmail = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`);
        const data = await response.json();

        if (!response.ok) {
            console.error("Backend error:", data); // Log the error response
            return {
                success: false,
                message: data.message || "Token expired or invalid"
            };
        }

        return { success: true, email: data.email };
    } catch (error) {
        console.error("Network error:", error);
        return { success: false, message: "Network error or server issue" };
    }
};



export const ResendVerificationForm = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
        });

        const data = await response.json();

        if (response.ok) {
            return data.message;
        } else {
            // The server responded with an error status (e.g., 400)
            return { success: false, message: data.message }; // Return the error message
        }
    } catch (error) {
        return { success: false, message: "Network error or server issue" };
    }
};

export const forgotPasswordRequest = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const resetPasswordRequest = async (token, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, { password, confirmPassword: password }); // Assuming confirmPassword is also sent (though backend checks)
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export {
    addCommentToFile,
    addReplyToComment,
    createFolder,
    deleteComment,
    deleteFile,
    deleteFolder,
    downloadFile,
    fetchUserData,
    getCommentsForFile,
    getFileMetadata,
    getFileVersions,
    getFolderById,
    listFilesForUser,
    listFoldersForUser,
    loginUser,
    moveFileToFolder,
    registerUser,
    searchFilesForUser,
    updateFileDescription,
    updateFolder, uploadFileVersions,
    uploadMultipleFiles
};

