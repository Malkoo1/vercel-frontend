import { X } from 'lucide-react';
import React from 'react';
import { useDocument } from '../../context/DocumentContext';

const CommentSidebar = ({ annotations, windowWidth, setShowSidebar }) => {
    // Current user info (in a real app, this would come from authentication)
    const currentUser = {
        avatar: "U",
        avatarColor: "bg-green-500"
    };

    const { removeComment, addComment } = useDocument();

    const handleDeleteComment = (annotation, comment) => {
        removeComment(annotation.id, comment.id);
    };

    const handleEditComment = (annotation, comment) => {
        // In a real implementation, this would open the comment for editing
        // This would set activeAnnotation and editingComment states
        // But since these states are in the parent component, we'd need to lift this state up
        // or use context to manage it
    };

    return (
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
                                onClick={() => {
                                    // This would need to call a function passed from the parent component
                                    // to set activeAnnotation and show the comments popup
                                }}
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
                                                            onClick={() => handleEditComment(annotation, comment)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="text-xs text-red-500"
                                                            onClick={() => handleDeleteComment(annotation, comment)}
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
    );
};

export default CommentSidebar;