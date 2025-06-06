import React, { useState, useEffect, useRef } from 'react';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            onStopTyping();
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        onTyping();
        typingTimeoutRef.current = setTimeout(() => {
            onStopTyping();
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
                <textarea
                    value={message}
                    onChange={handleChange}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        message.trim()
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Send
                </button>
            </div>
        </form>
    );
};

export default MessageInput; 