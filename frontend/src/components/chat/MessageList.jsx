import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Message';

const MessageList = ({ messages, currentUser, onEditMessage, onDeleteMessage, onReaction, onRemoveReaction }) => {
    const messagesEndRef = useRef(null);
    const lastMessageRef = useRef(null);

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentGroup = null;

        messages.forEach((message, index) => {
            const messageDate = new Date(message.created_at).toLocaleDateString();
            
            if (!currentGroup || currentGroup.date !== messageDate) {
                currentGroup = {
                    date: messageDate,
                    messages: []
                };
                groups.push(currentGroup);
            }
            
            currentGroup.messages.push(message);
        });

        return groups;
    };

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full text-gray-500 p-4 text-center"
            >
                <div className="max-w-sm">
                    <p className="text-lg font-medium mb-2">No messages yet</p>
                    <p className="text-sm text-gray-400">Be the first to start the conversation!</p>
                </div>
            </motion.div>
        );
    }

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="space-y-6 px-2 md:px-4">
            <AnimatePresence>
                {messageGroups.map((group, groupIndex) => (
                    <div key={group.date} className="space-y-4">
                        {/* Date Separator */}
                        <div className="flex items-center justify-center">
                            <div className="px-4 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                                {group.date}
                            </div>
                        </div>

                        {/* Messages in Group */}
                        {group.messages.map((message, index) => {
                            const isOwnMessage = message.user_id === currentUser.id;
                            const showAvatar = index === 0 || group.messages[index - 1]?.user_id !== message.user_id;
                            const isLastInGroup = index === group.messages.length - 1;
                            const isLastMessage = groupIndex === messageGroups.length - 1 && isLastInGroup;
                            
                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    ref={isLastMessage ? lastMessageRef : null}
                                >
                                    <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[90%] md:max-w-[85%]`}>
                                        {showAvatar && !isOwnMessage && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3498db] to-[#2c3e50] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                                {message.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <Message
                                            message={message}
                                            isOwnMessage={isOwnMessage}
                                            onEdit={onEditMessage}
                                            onDelete={onDeleteMessage}
                                            onReaction={onReaction}
                                            onRemoveReaction={onRemoveReaction}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 