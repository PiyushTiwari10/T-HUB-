import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { motion, AnimatePresence } from 'framer-motion';

const MessageList = ({ messages, currentUser, onEditMessage, onDeleteMessage, onReaction, onRemoveReaction }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = new Date(message.created_at).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No messages yet. Start the conversation!
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className="flex flex-col space-y-4 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="px-4 py-1 text-sm text-gray-500 bg-gray-100 rounded-full">
                            {date}
                        </div>
                    </div>
                    <AnimatePresence>
                        {dateMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Message
                                    message={message}
                                    isOwnMessage={message.user_id === currentUser.id}
                                    onEdit={onEditMessage}
                                    onDelete={onDeleteMessage}
                                    onReaction={onReaction}
                                    onRemoveReaction={onRemoveReaction}
                                    email={currentUser.email}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 