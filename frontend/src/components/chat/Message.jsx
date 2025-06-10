import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Message = ({ message, isOwnMessage, onEdit, onDelete, email }) => {
    console.log('Message component received:', { message, isOwnMessage });
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);

    const handleEdit = () => {
        if (editedContent.trim() && editedContent !== message.content) {
            onEdit(message.id, editedContent);
        }
        setIsEditing(false);
    };

    // Function to generate a color based on user ID
    const getMessageColor = (userId) => {
        if (!userId) return 'bg-gray-700';
        
        // Generate a hash from the user ID
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Predefined dark colors with good contrast
        const colors = [
            'bg-blue-700',
            'bg-purple-700',
            'bg-green-700',
            'bg-red-700',
            'bg-indigo-700',
            'bg-teal-700',
            'bg-pink-700',
            'bg-orange-700'
        ];
        
        // Use the hash to select a color
        const colorIndex = Math.abs(hash) % colors.length;
        return colors[colorIndex];
    };

    const messageColor = getMessageColor(message.user_id);

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 ${!isOwnMessage ? 'ml-4' : ''}`}>
            <div className={`max-w-[70%] ${messageColor} text-white rounded-2xl p-4 relative group shadow-md`}>
                {!isEditing ? (
                    <>
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <p className="text-sm font-medium mb-2 text-gray-100">
                                    {message.username || 'Anonymous'}
                                </p>
                                <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{message.content}</p>
                                {message.is_edited && (
                                    <span className="text-xs opacity-75 mt-1 block">(edited)</span>
                                )}
                            </div>
                            {isOwnMessage && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <FaEdit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(message.id)}
                                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <FaTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message; 