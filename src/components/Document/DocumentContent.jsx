import { ArrowLeft, Bell, Check, Clock, Download, Edit, Image, Menu, MessageSquare, MoreHorizontal, Search, Settings, Share, Smile, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DocumentReviewInterface = () => {
    // Initial annotations with comment threads
    const [annotations, setAnnotations] = useState([
        {
            id: 1,
            x: 350,
            y: 140,
            comments: [
                {
                    id: 1,
                    user: "Candice Wu",
                    avatar: "C",
                    avatarColor: "bg-orange-500",
                    text: "Hey team great to get started on this!",
                    time: "3 hours ago",
                    edited: false
                },
                {
                    id: 2,
                    user: "Alex Chen",
                    avatar: "A",
                    avatarColor: "bg-blue-500",
                    text: "Agreed! Looking forward to the collaboration.",
                    time: "2 hours ago",
                    edited: false
                }
            ]
        },
        {
            id: 2,
            x: 380,
            y: 250,
            comments: [
                {
                    id: 3,
                    user: "Candice Wu",
                    avatar: "C",
                    avatarColor: "bg-orange-500",
                    text: "This section needs more details.",
                    time: "3 hours ago",
                    edited: false
                }
            ]
        }
    ]);

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

    // Current user info (in a real app, this would come from authentication)
    const currentUser = {
        name: "Current User",
        avatar: "U",
        avatarColor: "bg-green-500"
    };

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

    const handleDocumentDoubleClick = (e) => {
        // Get position relative to the document container
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create a new annotation with empty comments array
        const newAnnotation = {
            id: nextAnnotationId,
            x,
            y,
            comments: []
        };

        setAnnotations([...annotations, newAnnotation]);
        setNextAnnotationId(nextAnnotationId + 1);
        setActiveAnnotation(newAnnotation);
        setShowComments(true);
        setShowEmojiPicker(false);
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

    const handleAddComment = () => {
        if (!newCommentText.trim()) return;

        // Create a new comment
        const newComment = {
            id: nextCommentId,
            user: currentUser.name,
            avatar: currentUser.avatar,
            avatarColor: currentUser.avatarColor,
            text: newCommentText,
            time: "Just now",
            edited: false
        };

        // Update the annotations array with the new comment
        const updatedAnnotations = annotations.map(annotation => {
            if (annotation.id === activeAnnotation.id) {
                return {
                    ...annotation,
                    comments: [...annotation.comments, newComment]
                };
            }
            return annotation;
        });

        // Update state
        setAnnotations(updatedAnnotations);
        setNextCommentId(nextCommentId + 1);
        setNewCommentText("");

        // Update active annotation to reflect changes
        const updatedActiveAnnotation = updatedAnnotations.find(
            annotation => annotation.id === activeAnnotation.id
        );
        setActiveAnnotation(updatedActiveAnnotation);
    };

    const startEditComment = (annotation, comment) => {
        setEditingComment(comment);
        setEditCommentText(comment.text);
    };

    const cancelEditComment = () => {
        setEditingComment(null);
        setEditCommentText("");
    };

    const saveEditComment = () => {
        if (!editCommentText.trim()) return;

        // Update the annotations array with the edited comment
        const updatedAnnotations = annotations.map(annotation => {
            if (annotation.id === activeAnnotation.id) {
                return {
                    ...annotation,
                    comments: annotation.comments.map(comment => {
                        if (comment.id === editingComment.id) {
                            return {
                                ...comment,
                                text: editCommentText,
                                edited: true,
                                time: "Edited just now"
                            };
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
    };

    const deleteComment = (annotation, comment) => {
        // Create updated annotations without the deleted comment
        const updatedAnnotations = annotations.map(ann => {
            if (ann.id === annotation.id) {
                return {
                    ...ann,
                    comments: ann.comments.filter(com => com.id !== comment.id)
                };
            }
            return ann;
        });

        // Update state
        setAnnotations(updatedAnnotations);

        // Update active annotation to reflect changes
        if (activeAnnotation && activeAnnotation.id === annotation.id) {
            const updatedActiveAnnotation = updatedAnnotations.find(
                ann => ann.id === annotation.id
            );
            setActiveAnnotation(updatedActiveAnnotation);
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

    return (
        <div className="flex flex-col h-screen bg-gray-100">
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
                    <h1 className="font-bold text-sm sm:text-base truncate">Seeds Design Session Optimierung von Prompts für KI (1).pdf</h1>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">"Hey team great to get started on this!" <Check size={12} className="inline text-gray-400" /></p>
                </div>

                {windowWidth >= 640 ? (
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full border border-gray-200">
                            <Share size={20} />
                        </button>
                        <button className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
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
                    <span className="mr-2">#</span>
                    <h2 className="font-medium text-sm sm:text-base truncate">Seeds Design Session Optimierung von Prompts für KI (1).pdf</h2>
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
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Ein Hoch auf die Expertise</h2>

                        <ul className="space-y-4 mb-6">
                            <li className="flex gap-2">
                                <span>•</span>
                                <p>Eine weitere Möglichkeit mit KI erstellte Bilder aufs nächste zu heben ist die Verwendung von Fachbegriffen im Prompt.</p>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <p>So können diverse facheinschlägige Beschreibungen dabei helfen, dem Modell diverse Detailinformationen zu vermitteln.</p>
                            </li>
                        </ul>

                        {/* Annotation Markers */}
                        {annotations.map((annotation) => (
                            <div
                                key={annotation.id}
                                className="absolute"
                                style={{ top: annotation.y, left: annotation.x }}
                                onClick={() => handleAnnotationClick(annotation)}
                            >
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${annotation.id === 1 ? 'bg-orange-500' :
                                    annotation.id === 2 ? 'bg-blue-500' : 'bg-green-500'
                                    } flex items-center justify-center text-white cursor-pointer shadow-lg text-xs`}>
                                    {annotation.id}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment Popup - Now with Edit & Delete */}
                    {showComments && activeAnnotation && (
                        <div className="absolute top-1/4 right-4 sm:right-1/4 bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:w-96 overflow-hidden">
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
                                                    <p className="font-medium text-sm">{comment.user}</p>
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {comment.time}
                                                            {comment.edited && <span className="italic ml-1">(edited)</span>}
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
                            {annotations.map((annotation) => (
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
                                                                <p className="font-medium text-xs">{comment.user}</p>
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    {comment.time}
                                                                    {comment.edited && <span className="italic ml-1">(edited)</span>}
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