import { Edit, Smile, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import EmojiPicker from './EmojiPicker';

const CommentPopup = ({ annotation, onClose, onAddComment }) => {
    const { removeComment } = useDocument();
    const [newCommentText, setNewCommentText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");


    // Current user info (in a real app, this would come from authentication)
    const currentUser = {
        name: "Current User",
        avatar: "U",
        avatarColor: "bg-green-500"
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    // const handleAddComment = () => {
    //     if (!newCommentText.trim()) return;

    //     // Create a new comment
    //     const newComment = {
    //         user: currentUser.name,
    //         avatar: currentUser.avatar,
    //         avatarColor: currentUser.avatarColor,
    //         text: newCommentText
    //     };

    //     addComment(annotation.id, newComment);
    //     setNewCommentText("");
    // };

    const handleLocalAddComment = () => {
        console.log("handleLocalAddComment called");
        if (onAddComment) {
            console.log("onAddComment prop exists, calling it with text:", newCommentText);
            onAddComment(newCommentText); // Pass newCommentText as an argument
            setNewCommentText(""); // Clear the input field after submitting
        } else {
            console.log("onAddComment prop is not defined!");
        }
    };
    const startEditComment = (comment) => {
        setEditingComment(comment);
        setEditCommentText(comment.text);
    };

    const cancelEditComment = () => {
        setEditingComment(null);
        setEditCommentText("");
    };

    const saveEditComment = () => {
        if (!editCommentText.trim()) return;

        // In a real app, you would call an API to update the comment
        // For now, we're just updating local state

        // Exit edit mode
        setEditingComment(null);
        setEditCommentText("");
    };

    const deleteComment = (comment) => {
        removeComment(annotation.id, comment.id);
    };

    const addEmojiToComment = (emoji) => {
        if (editingComment) {
            setEditCommentText(editCommentText + emoji);
        } else {
            setNewCommentText(newCommentText + emoji);
        }
        setShowEmojiPicker(false);
    };

    return (
        <div className="absolute top-1/4 right-4 sm:right-1/4 bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:w-96 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold">Comments on Annotation #{annotation?.id}</h3>
                <button onClick={onClose} className="text-gray-500">×</button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto">
                {annotation?.comments?.length > 0 ? (
                    annotation.comments.map((comment) => (
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
                                                    onClick={() => startEditComment(comment)}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    className="ml-1 text-gray-400 hover:text-red-500"
                                                    onClick={() => deleteComment(comment)}
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
                            onKeyPress={(e) => e.key === 'Enter' && handleLocalAddComment()}
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
                        onClick={handleLocalAddComment}
                        className="px-4 py-1 bg-red-500 text-white rounded-full text-sm"
                        disabled={!newCommentText.trim()}
                    >
                        Post Comment
                    </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <EmojiPicker
                        onSelectEmoji={addEmojiToComment}
                        onClose={() => setShowEmojiPicker(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CommentPopup;