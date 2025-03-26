import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { ArrowLeft, Bell, Check, Clock, Download, Edit, Image, Menu, MessageSquare, MoreHorizontal, Search, Settings, Share, Smile, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchUserData } from '../services/api';
import { API_BASE_URL, deleteComment as apiDeleteComment, updateComment as apiUpdateComment, approveDocument, fetchDocument, saveAnnotation, saveComment } from '../services/api2';
import CustomToast from "./Toast";
// const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// };

const getRandomColor = () => {
    const tailwindColors = [
        "bg-red-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-gray-500",
        "bg-teal-500",
        "bg-orange-500",
        // Add more Tailwind background color classes as needed
    ];
    const randomIndex = Math.floor(Math.random() * tailwindColors.length);
    return tailwindColors[randomIndex];
};

const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;

}
const DocumentReviewInterface = ({ documentId }) => {
    // Initial annotations with comment threads


    const [docs, setDocs] = useState([]);
    const [documentData, setDocumentData] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeAnnotation, setActiveAnnotation] = useState(null);
    const [nextAnnotationId, setNextAnnotationId] = useState(3);
    const [nextCommentId, setNextCommentId] = useState(4);
    const [newCommentText, setNewCommentText] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGuestPopupOpen, setIsGuestPopupOpen] = useState(false);
    const [guestUserName, setGuestUserName] = useState('');
    const [guestAvatarColor, setGuestAvatarColor] = useState('');
    const [isGuestUser, setIsGuestUser] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: "Guest User",
        avatar: "G",
        avatarColor: getRandomColor()
    });

    const [toast, setToast] = useState({
        open: false,
        message: "",
        type: "info", // default type
    });

    // useCallback to prevent re-creation on every render if passed as props
    const showToast = useCallback((message, type = "info") => {
        setToast({ open: true, message, type });
        // Automatically close the toast after a delay (optional)
        setTimeout(() => {
            setToast({ ...toast, open: false }); // Keep type and message, just close
        }, 5000); // Adjust delay as needed (e.g., 3000ms = 3 seconds)
    }, [setToast]);

    useEffect(() => {
        const checkAuth = async () => {
            if (!isGuestUser) { // Only check authentication if not a guest user
                try {
                    const user = await fetchUserData();
                    setCurrentUser({
                        id: user._id,
                        guestName: user.username || 'Authenticated User',
                        avatar: user.username[0].toUpperCase(),
                        avatarColor: user.avatarColor,
                    });
                    setGuestUserName(user.username);
                    setGuestAvatarColor(user.avatarColor);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Authentication error:", error);
                    setIsAuthenticated(false);
                    setIsGuestPopupOpen(true);
                }
            }
        };

        checkAuth();
    }, [isGuestUser]);

    const handleGuestNameSubmit = (name) => {
        setGuestUserName(name);
        setGuestAvatarColor(getRandomColor());
        setCurrentUser({
            id: null,
            guestName: name,
            avatar: name[0].toUpperCase(),
            avatarColor: guestAvatarColor || getRandomColor() // Use the generated color
        });
        setIsGuestUser(true);
    };


    // Current user info (in a real app, this would come from authentication)
    // const currentUser = {
    //     name: "Current User",
    //     avatar: "U",
    //     avatarColor: "bg-green-500"
    // };



    useEffect(() => {
        if (documentData) {
            // Extract main document details
            const mainDoc = {
                uri: `${API_BASE_URL}/${documentData.path}`, // Assuming path is a direct URL or needs to be prefixed
                name: documentData.name,
            };

            // Extract versions if available
            const versionDocs = documentData?.versions?.map(version => ({
                uri: `${API_BASE_URL}/${version.path}`,
                name: version.name,
            })) ?? [];

            // Update state with all documents
            setDocs([mainDoc, ...versionDocs]);
        }
    }, [documentData]);

    useEffect(() => {
        const loadDocument = async () => {
            try {
                const data = await fetchDocument(documentId);
                setDocumentData(data);
                setAnnotations(data.annotations);
            } catch (error) {
                console.error('Failed to load document:', error);
            }
        };

        loadDocument();
    }, [documentId]);

    // Handle window resize for responsiveness
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDocumentDoubleClick = async (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newAnnotation = {
            id: nextAnnotationId,
            x,
            y,
            comments: []
        };

        try {
            const savedAnnotation = await saveAnnotation(documentId, newAnnotation);
            setAnnotations([...annotations, savedAnnotation]);
            setNextAnnotationId(nextAnnotationId + 1);
            setActiveAnnotation(savedAnnotation);
            setShowComments(true);
            setShowEmojiPicker(false);
        } catch (error) {
            console.error('Failed to save annotation:', error);
        }
    };

    const handleAnnotationClick = (annotation) => {
        setActiveAnnotation(annotation);
        setShowComments(true);
        setShowEmojiPicker(false);
        // On mobile, close the sidebar when opening a comment
        if (windowWidth < 768) {
            setShowSidebar(false);
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const closeCommentPopup = () => {
        setShowComments(false);
        setActiveAnnotation(null);
        setNewCommentText("");
        setEditingComment(null);
    };

    const handleAddComment = async () => {
        if (!newCommentText.trim()) return;



        const newComment = {
            id: nextCommentId, // Frontend ID
            text: newCommentText,
            time: "Just now", // Backend will provide the actual timestamp
            edited: false,
            userId: isAuthenticated ? currentUser.id : null, // Add userId if authenticated, otherwise null
            guestName: isGuestUser ? guestUserName : null, // Add guestName if guest user, otherwise null
            avatar: currentUser.avatar,
            avatarColor: currentUser.avatarColor,
        };

        try {
            const savedComment = await saveComment(documentId, activeAnnotation.id, newComment);
            const updatedAnnotations = annotations.map(annotation => {
                if (annotation.id === activeAnnotation.id) {
                    return {
                        ...annotation,
                        comments: [...annotation.comments, savedComment]
                    };
                }
                return annotation;
            });

            setAnnotations(updatedAnnotations);
            setNextCommentId(nextCommentId + 1);
            setNewCommentText("");
            setActiveAnnotation(updatedAnnotations.find(annotation => annotation.id === activeAnnotation.id));
        } catch (error) {
            console.error('Failed to save comment:', error);
        }
    };

    const startEditComment = (annotation, comment) => {
        setEditingComment(comment);
        setEditCommentText(comment.text);
    };

    const cancelEditComment = () => {
        setEditingComment(null);
        setEditCommentText("");
    };



    const saveEditComment = async () => {
        if (!editCommentText.trim()) return;

        try {
            const updatedCommentFromBackend = await apiUpdateComment(
                documentId,
                activeAnnotation.id,
                editingComment.id,
                editCommentText
            );

            // Update the annotations array with the edited comment from the backend
            const updatedAnnotations = annotations.map(annotation => {
                if (annotation.id === activeAnnotation.id) {
                    return {
                        ...annotation,
                        comments: annotation.comments.map(comment => {
                            if (comment.id === editingComment.id) {
                                return updatedCommentFromBackend; // Use the updated comment from the backend
                            }
                            return comment;
                        })
                    };
                }
                return annotation;
            });

            // Update state
            setAnnotations(updatedAnnotations);

            // Update active annotation to reflect changes
            const updatedActiveAnnotation = updatedAnnotations.find(
                annotation => annotation.id === activeAnnotation.id
            );
            setActiveAnnotation(updatedActiveAnnotation);

            // Exit edit mode
            setEditingComment(null);
            setEditCommentText("");

        } catch (error) {
            console.error('Failed to update comment:', error);
            // Optionally handle the error (e.g., show a message to the user)
        }
    };
    const deleteComment = async (annotation, comment) => {
        try {
            await apiDeleteComment(documentId, annotation.id, comment.id);
            const updatedAnnotations = annotations.map(ann => {
                if (ann.id === annotation.id) {
                    return {
                        ...ann,
                        comments: ann.comments.filter(com => com.id !== comment.id)
                    };
                }
                return ann;
            });

            setAnnotations(updatedAnnotations);
            if (activeAnnotation && activeAnnotation.id === annotation.id) {
                setActiveAnnotation(updatedAnnotations.find(ann => ann.id === annotation.id));
            }

        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const addEmojiToComment = (emoji) => {
        if (editingComment) {
            setEditCommentText(editCommentText + emoji);
        } else {
            setNewCommentText(newCommentText + emoji);
        }
        setShowEmojiPicker(false);
    };

    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
        "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘",
        "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓",
        "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟",
        "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺"
    ];

    const handleApprove = async () => {
        try {
            // Prepare approval data
            const approvalData = {
                userId: isAuthenticated ? currentUser.id : null, // For registered users
                guestName: isGuestUser ? currentUser.guestName : null, // For guest users
                avatar: isGuestUser ? currentUser.avatar : null, // Optional for guest users
                avatarColor: currentUser.avatarColor, // Optional for guest users
            };

            // Call the API function
            const updatedDocument = await approveDocument(documentId, approvalData);

            // Update document state with new data
            setDocumentData(updatedDocument.document);

            // Show success toast
            showToast('Approval saved successfully!', 'success');
        } catch (error) {
            console.log(error);
            showToast('Failed to save approval', 'error');
        }
    };

    if (!documentData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {toast.open && <CustomToast message={toast.message} type={toast.type} />}
            <GuestUserPopup
                isOpen={!isAuthenticated && isGuestPopupOpen}
                onClose={() => setIsGuestPopupOpen(false)}
                onGuestNameSubmit={handleGuestNameSubmit}
            />
            {/* Header - Responsive */}
            <header className="bg-white border-b border-gray-200 flex items-center px-2 sm:px-4 py-2">
                <button className="p-2 rounded-full bg-red-100 text-red-500 mr-2 sm:mr-4">
                    <ArrowLeft size={20} />
                </button>

                {windowWidth < 640 ? (
                    <button onClick={toggleMobileMenu} className="p-2 mr-2">
                        <Menu size={20} />
                    </button>
                ) : (
                    <div className="bg-gray-200 rounded-full p-2 mr-4">
                        <div className="text-red-500 font-bold">S</div>
                    </div>
                )}

                <div className="flex-1 truncate">
                    <h1 className="font-bold text-sm sm:text-base truncate">{documentData && documentData.name}</h1>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">{documentData && documentData.description} <Check size={12} className="inline text-gray-400" /></p>
                </div>

                {windowWidth >= 640 ? (
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full border border-gray-200">
                            <Share size={20} />
                        </button>
                        <button onClick={handleApprove} className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                            <Check size={16} />
                            <span className="hidden sm:inline">Approved</span>
                        </button>
                        <button className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                            <Download size={16} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button className="p-2 rounded-full border border-gray-200">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                ) : (
                    <button className="p-2 rounded-full border border-gray-200">
                        <MoreHorizontal size={20} />
                    </button>
                )}
            </header>

            {/* Mobile Menu */}
            {showMobileMenu && windowWidth < 640 && (
                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="grid grid-cols-3 gap-2">
                        <button className="p-2 flex flex-col items-center justify-center border rounded">
                            <Share size={20} />
                            <span className="text-xs mt-1">Share</span>
                        </button>
                        <button className="p-2 flex flex-col items-center justify-center border rounded bg-red-500 text-white">
                            <Check size={20} />
                            <span className="text-xs mt-1">Approve</span>
                        </button>
                        <button className="p-2 flex flex-col items-center justify-center border rounded bg-red-500 text-white">
                            <Download size={20} />
                            <span className="text-xs mt-1">Export</span>
                        </button>
                        <button className="p-2 flex flex-col items-center justify-center border rounded" onClick={toggleSidebar}>
                            <MessageSquare size={20} />
                            <span className="text-xs mt-1">Comments</span>
                        </button>
                    </div>
                    <button onClick={toggleMobileMenu} className="mt-4 w-full py-2 border rounded flex justify-center">
                        <X size={16} className="mr-2" /> Close Menu
                    </button>
                </div>
            )}

            {/* Document Title Bar - Responsive */}
            <div className="bg-white py-2 px-2 sm:px-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center truncate">
                    {/* <span className="mr-2">#</span> */}
                    <h2 className="font-medium text-sm sm:text-base truncate">{documentData && documentData.name}</h2>
                </div>

                <div className="flex items-center">
                    <div className="flex -space-x-2 mr-2 sm:mr-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-xs">C</div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">A</div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs">+3</div>
                    </div>

                    {windowWidth >= 640 && (
                        <button className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
                            <span>Add Participant</span>
                        </button>
                    )}

                    {windowWidth < 768 && (
                        <button
                            onClick={toggleSidebar}
                            className="ml-2 p-2 border rounded-full"
                        >
                            <MessageSquare size={16} className={showSidebar ? "text-red-500" : "text-gray-500"} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Document Area */}
                <div className={`${showSidebar && windowWidth < 768 ? 'hidden' : 'flex-1'} bg-gray-100 overflow-auto relative p-2 sm:p-4`}>
                    {/* Document Content */}
                    <div
                        className="bg-white p-4 sm:p-6 rounded shadow-sm mx-auto max-w-3xl relative"
                        onDoubleClick={handleDocumentDoubleClick}
                        style={{ minHeight: "600px" }}
                    >
                        {/* <h2 className="text-xl sm:text-2xl font-bold mb-4">Ein Hoch auf die Expertise</h2>

                        <ul className="space-y-4 mb-6">
                            <li className="flex gap-2">
                                <span>•</span>
                                <p>Eine weitere Möglichkeit mit KI erstellte Bilder aufs nächste zu heben ist die Verwendung von Fachbegriffen im Prompt.</p>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <p>So können diverse facheinschlägige Beschreibungen dabei helfen, dem Modell diverse Detailinformationen zu vermitteln.</p>
                            </li>
                        </ul> */}
                        {documentData && documentData.type === 'pdf' ? (

                            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />


                        ) : (

                            <img
                                src={`${API_BASE_URL}/${documentData.path}`}
                                alt={documentData.name}
                                className="w-full max-w-md mx-auto rounded-lg shadow-md"
                            />
                        )}
                        {/* {documentData && (
                            <div className="mb-4  rounded">
                                <img
                                    src={`${API_BASE_URL}/${documentData.path}`}
                                    alt={documentData.name}
                                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                                />

                            </div>
                        )} */}

                        {documentData?.versions?.length > 0 && (
                            <div className="mb-4">
                                {documentData.versions.map((version) => (
                                    <div key={version.id} className="mb-2">

                                        <img
                                            src={`${API_BASE_URL}/${version.path}`}
                                            alt={version.name}
                                            className="w-full max-w-md mx-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Annotation Markers */}
                        {annotations && annotations.map((annotation) => (
                            <div
                                key={annotation.id}
                                className="absolute z-40"
                                style={{ top: annotation.y, left: annotation.x }}
                                onClick={() => handleAnnotationClick(annotation)}
                            >
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${annotation.id === 1
                                    ? 'bg-orange-500'
                                    : annotation.id === 2
                                        ? 'bg-blue-500'
                                        : 'bg-green-500'
                                    } flex items-center justify-center text-white cursor-pointer shadow-lg text-xs`}>
                                    {annotation.id}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment Popup - Now with Edit & Delete */}
                    {showComments && activeAnnotation && (
                        <div className="absolute top-1/4 z-41 right-4 sm:right-1/4 bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:w-96 overflow-hidden">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="font-bold">Comments on Annotation #{activeAnnotation.id}</h3>
                                <button onClick={closeCommentPopup} className="text-gray-500">×</button>
                            </div>

                            <div className="p-4 max-h-80 overflow-y-auto">
                                {activeAnnotation.comments.length > 0 ? (
                                    activeAnnotation.comments.map((comment) => (
                                        <div key={comment.id} className="flex items-start mb-4">
                                            <div className={`w-8 h-8 rounded-full ${comment.avatarColor} flex items-center justify-center text-white mr-2 flex-shrink-0`}>
                                                {comment.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <p className="font-medium text-sm">{comment.userId ? comment.userId.username : comment.guestName}</p>
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {timeAgo(comment.updatedAt)}
                                                            {comment.edited && <span className="italic ml-1">(update)</span>}
                                                        </span>

                                                        {/* Only show edit and delete for current user's comments */}
                                                        {comment.avatar === currentUser.avatar && (
                                                            <div className="flex">
                                                                <button
                                                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                                                    onClick={() => startEditComment(activeAnnotation, comment)}
                                                                >
                                                                    <Edit size={14} />
                                                                </button>
                                                                <button
                                                                    className="ml-1 text-gray-400 hover:text-red-500"
                                                                    onClick={() => deleteComment(activeAnnotation, comment)}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {editingComment && editingComment.id === comment.id ? (
                                                    <div className="mt-1">
                                                        <textarea
                                                            className="w-full p-2 border rounded text-sm"
                                                            value={editCommentText}
                                                            onChange={(e) => setEditCommentText(e.target.value)}
                                                            rows={3}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                onClick={cancelEditComment}
                                                                className="px-3 py-1 text-xs border rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={saveEditComment}
                                                                className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                                                                disabled={!editCommentText.trim()}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm mt-1">{comment.text}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No comments yet. Be the first to comment!</p>
                                )}
                            </div>

                            <div className="p-4 border-t">
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full ${currentUser.avatarColor} flex items-center justify-center text-white mr-2 flex-shrink-0`}>
                                        {currentUser.avatar}
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            className="bg-transparent w-full outline-none text-sm"
                                            value={newCommentText}
                                            onChange={(e) => setNewCommentText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-3">
                                    <button
                                        onClick={toggleEmojiPicker}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <Smile size={20} />
                                    </button>

                                    <button
                                        onClick={handleAddComment}
                                        className="px-4 py-1 bg-red-500 text-white rounded-full text-sm"
                                        disabled={!newCommentText.trim()}
                                    >
                                        Post Comment
                                    </button>
                                </div>

                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div className="absolute bottom-24 left-0 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64 z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-500">Smiley & People</span>
                                            <button onClick={() => setShowEmojiPicker(false)} className="text-gray-500">×</button>
                                        </div>
                                        <div className="border-b pb-2 mb-2">
                                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                                <Search size={14} className="text-gray-400 mr-2" />
                                                <input type="text" placeholder="Search" className="bg-transparent text-sm outline-none flex-1" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-8 gap-1">
                                            {emojis.map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    className="text-xl hover:bg-gray-100 p-1 rounded"
                                                    onClick={() => addEmojiToComment(emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2 pt-2 border-t">
                                            <button className="text-gray-400"><Clock size={16} /></button>
                                            <button className="text-gray-400"><Smile size={16} /></button>
                                            <button className="text-gray-400"><Image size={16} /></button>
                                            <button className="text-gray-400"><Bell size={16} /></button>
                                            <button className="text-gray-400"><Settings size={16} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Now Toggleable on Mobile */}
                {(showSidebar || windowWidth >= 768) && (
                    <div className={`${windowWidth < 768 ? 'absolute inset-0 z-10' : 'w-64 md:w-80'} bg-white border-l border-gray-200 overflow-auto h-full`}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-medium">Annotations & Comments</h3>
                            {windowWidth < 768 && (
                                <button onClick={() => setShowSidebar(false)} className="text-gray-500">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="p-4">
                            {annotations && annotations.map((annotation) => (
                                <div key={annotation.id} className="mb-6">
                                    <div className="flex items-center mb-2">
                                        <div className={`w-6 h-6 rounded-full ${annotation.id === 1 ? 'bg-orange-500' :
                                            annotation.id === 2 ? 'bg-blue-500' : 'bg-green-500'
                                            } flex items-center justify-center text-white text-xs font-bold mr-2`}>
                                            {annotation.id}
                                        </div>
                                        <h4 className="font-medium text-sm">Annotation #{annotation.id}</h4>
                                        <button
                                            className="ml-auto text-blue-500 text-xs"
                                            onClick={() => handleAnnotationClick(annotation)}
                                        >
                                            View
                                        </button>
                                    </div>

                                    {annotation.comments.length > 0 ? (
                                        <div className="ml-8 space-y-4">
                                            {annotation.comments.map((comment) => (
                                                <div key={comment.id} className="mb-3">
                                                    <div className="flex items-start">
                                                        <div className={`w-6 h-6 rounded-full ${comment.avatarColor} flex items-center justify-center text-white text-xs mr-2 flex-shrink-0`}>
                                                            {comment.avatar}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-1 flex-wrap">
                                                                <p className="font-medium text-xs">{comment.userId ? comment.userId.username : comment.guestName}</p>
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    {timeAgo(comment.updatedAt)}
                                                                    {comment.edited && <span className="italic ml-1">(update)</span>}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1">
                                                                <p className="text-xs">{comment.text}</p>
                                                            </div>

                                                            {/* Comment action buttons in sidebar */}
                                                            {comment.avatar === currentUser.avatar && (
                                                                <div className="flex mt-1 gap-2">
                                                                    <button
                                                                        className="text-xs text-blue-500"
                                                                        onClick={() => {
                                                                            handleAnnotationClick(annotation);
                                                                            setTimeout(() => startEditComment(annotation, comment), 100);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="text-xs text-red-500"
                                                                        onClick={() => deleteComment(annotation, comment)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="ml-8 text-gray-500 text-xs italic">No comments yet</p>
                                    )}

                                    <div className="w-full h-px bg-gray-100 mt-4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        className={`p-1 ${showSidebar ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'} rounded`}
                        onClick={toggleSidebar}
                    >
                        <MessageSquare size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">60%</span>
                    <button className="p-1 text-gray-400">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default DocumentReviewInterface;


const GuestUserPopup = ({ isOpen, onClose, onGuestNameSubmit }) => {
    const [guestName, setGuestName] = useState('');

    const handleSubmit = () => {
        if (guestName.trim()) {
            onGuestNameSubmit(guestName);
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-modal-200 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="guestUserPopup">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome Guest!</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">Please enter your name to continue as a guest.</p>
                    </div>
                    <div className="px-7 py-3">
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Your Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-red-500 text-white text-base font-semibold rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};