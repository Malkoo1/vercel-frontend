// src/components/CommentPopup.js
import { Bell, Clock, Edit, Image, Search, Settings, Smile, Trash2, X } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { AnnotationsContext } from '../../context/AnnotationsContext';

const CommentPopup = ({ onClose }) => {
    const { activeAnnotation, currentUser, handleAddCommentToAnnotation, handleEditComment, handleDeleteComment } = useContext(AnnotationsContext);
    const [newCommentText, setNewCommentText] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    if (!activeAnnotation) {
        return null;
    }

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleAddComment = () => {
        if (!newCommentText.trim()) return;
        handleAddCommentToAnnotation(activeAnnotation.id, newCommentText);
        setNewCommentText("");
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
        handleEditComment(activeAnnotation.id, editingComment.id, editCommentText);
        setEditingComment(null);
        setEditCommentText("");
    };

    const deleteComment = (comment) => {
        handleDeleteComment(activeAnnotation.id, comment.id);
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
        <div className="absolute top-1/4 right-4 sm:right-1/4 bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:w-96 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold">Comments on Annotation #{activeAnnotation.id}</h3>
                <button onClick={onClose} className="text-gray-500">
                    <X />
                </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto">
                {activeAnnotation.comments && activeAnnotation.comments.length > 0 ? (
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
                                        {comment.user === currentUser.name && (
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
                            <button onClick={() => setShowEmojiPicker(false)} className="text-gray-500">
                                <X />
                            </button>
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
    );
};

export default CommentPopup;