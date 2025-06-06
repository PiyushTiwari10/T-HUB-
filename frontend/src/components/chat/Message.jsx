import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSmile } from 'react-icons/fa';

const Message = ({ message, isOwnMessage, onEdit, onDelete, onReaction, onRemoveReaction }) => {
    console.log('Message component received:', { message, isOwnMessage });
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    const handleEdit = () => {
        if (editedContent.trim() && editedContent !== message.content) {
            onEdit(message.id, editedContent);
        }
        setIsEditing(false);
    };

    const handleReaction = (reactionType) => {
        onReaction(message.id, reactionType);
        setShowReactionPicker(false);
    };

    const reactions = {
        '👍': 'thumbsup',
        '❤️': 'heart',
        '😂': 'laugh',
        '😮': 'wow',
        '😢': 'sad',
        '👏': 'clap'
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3 relative group`}>
                {!isEditing ? (
                    <>
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium mb-1">
                                    {message.username || 'Anonymous'}
                                </p>
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                {message.is_edited && (
                                    <span className="text-xs opacity-75">(edited)</span>
                                )}
                            </div>
                            {isOwnMessage && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1 hover:bg-white/20 rounded"
                                    >
                                        <FaEdit className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(message.id)}
                                        className="p-1 hover:bg-white/20 rounded"
                                    >
                                        <FaTrash className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => setShowReactionPicker(!showReactionPicker)}
                                className="text-sm opacity-75 hover:opacity-100"
                            >
                                <FaSmile />
                            </button>
                            {message.reactions && Object.entries(message.reactions).map(([type, count]) => (
                                <button
                                    key={type}
                                    onClick={() => onReaction(message.id, type)}
                                    className="text-sm bg-white/20 rounded-full px-2 py-0.5"
                                >
                                    {type} {count}
                                </button>
                            ))}
                        </div>
                        {showReactionPicker && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 flex gap-1">
                                {Object.entries(reactions).map(([emoji, type]) => (
                                    <button
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
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