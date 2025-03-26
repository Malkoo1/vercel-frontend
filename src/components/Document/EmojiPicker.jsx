import { Bell, Clock, Image, Search, Settings, Smile } from 'lucide-react';
import React from 'react';

const EmojiPicker = ({ onSelectEmoji, onClose }) => {
    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
        "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘",
        "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓",
        "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟",
        "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺"
    ];

    return (
        <div className="absolute bottom-24 left-0 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64 z-10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Smiley & People</span>
                <button onClick={onClose} className="text-gray-500">×</button>
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
                        onClick={() => onSelectEmoji(emoji)}
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
    );
};

export default EmojiPicker;