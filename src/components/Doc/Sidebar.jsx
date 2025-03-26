// src/components/Sidebar.js
import { X } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { AnnotationsContext } from '../../context/AnnotationsContext';

const Sidebar = ({ showSidebar, onToggleSidebar }) => {
    const { annotations, activeAnnotation, setActiveAnnotation, currentUser, handleEditComment, handleDeleteComment } = useContext(AnnotationsContext);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    const startEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.text);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const saveEditComment = (annotationId, comment) => {
        if (!editCommentText.trim()) return;
        handleEditComment(annotationId, comment.id, editCommentText);
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const deleteComment = (annotationId, comment) => {
        handleDeleteComment(annotationId, comment.id);
    };

    return (
        <div className={`${showSidebar ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out absolute top-0 right-0 w-64 md:w-80 bg-white border-l border-gray-200 overflow-auto h-full z-20 sm:relative sm:translate-x-0`}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Annotations & Comments</h3>
                <button onClick={onToggleSidebar} className="text-gray-500 sm:hidden">
                    <X size={20} />
                </button>
            </div>

            <div className="p-4">
                {annotations && annotations.map((annotation) => (
                    <div key={annotation.id} className="mb-6">
                        <div className="flex items-center mb-2">
                            <div className={`w-6 h-6 rounded-full ${annotation.id % 3 === 1 ? 'bg-orange-500' :
                                annotation.id % 3 === 2 ? 'bg-blue-500' : 'bg-green-500'
                                } flex items-center justify-center text-white text-xs font-bold mr-2`}>
                                {annotation.id}
                            </div>
                            <h4 className="font-medium text-sm">Annotation #{annotation.id}</h4>
                            <button
                                className="ml-auto text-blue-500 text-xs"
                                onClick={() => setActiveAnnotation(annotation)}
                            >
                                View
                            </button>
                        </div>

                        {annotation.comments && annotation.comments.length > 0 ? (
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
                                                {editingCommentId === comment.id ? (
                                                    <div className="mt-1">
                                                        <textarea
                                                            className="w-full p-2 border rounded text-xs"
                                                            value={editCommentText}
                                                            onChange={(e) => setEditCommentText(e.target.value)}
                                                            rows={2}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-1">
                                                            <button
                                                                onClick={cancelEditComment}
                                                                className="px-2 py-1 text-xxs border rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => saveEditComment(annotation.id, comment)}
                                                                className="px-2 py-1 text-xxs bg-red-500 text-white rounded"
                                                                disabled={!editCommentText.trim()}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-1">
                                                        <p className="text-xs">{comment.text}</p>
                                                    </div>
                                                )}

                                                {comment.user === currentUser.name && editingCommentId !== comment.id && (
                                                    <div className="flex mt-1 gap-2">
                                                        <button
                                                            className="text-xxs text-blue-500"
                                                            onClick={() => startEditComment(comment)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="text-xxs text-red-500"
                                                            onClick={() => deleteComment(annotation.id, comment)}
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
                            <p className="ml-8 text-gray-500 text-xs italic">No comments yet.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;