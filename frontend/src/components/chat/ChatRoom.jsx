import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ActiveUsers from './ActiveUsers';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaTimes, FaChevronLeft } from 'react-icons/fa';
import { SOCKET_URL } from '../../config';

const ChatRoom = ({ roomId, currentUser, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Map());
    const [error, setError] = useState(null);
    const [showUsers, setShowUsers] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Check if mobile on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape' && showUsers) {
                setShowUsers(false);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showUsers]);

    useEffect(() => {
        console.log('ChatRoom mounted with:', { roomId, currentUser });
        
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        // Connection event handlers
        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            setError(null);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Failed to connect to chat server');
        });

        // Join room
        socketRef.current.emit('join_room', {
            roomId,
            userId: currentUser.id,
            username: currentUser.username
        });

        // Load initial messages
        fetchMessages();

        // Socket event listeners
        socketRef.current.on('new_message', (message) => {
            console.log('New message received:', message);
            handleNewMessage(message);
        });

        socketRef.current.on('message_edited', (editedMessage) => {
            console.log('Message edited:', editedMessage);
            handleMessageEdited(editedMessage);
        });

        socketRef.current.on('message_deleted', ({ messageId }) => {
            console.log('Message deleted:', messageId);
            handleMessageDeleted({ messageId });
        });

        socketRef.current.on('user_joined', ({ userId, username, activeUsers }) => {
            console.log('User joined:', { userId, username, activeUsers });
            handleUserJoined({ userId, username, activeUsers });
        });

        socketRef.current.on('user_left', ({ userId, activeUsers }) => {
            console.log('User left:', { userId, activeUsers });
            handleUserLeft({ userId, activeUsers });
        });

        socketRef.current.on('active_users', (users) => {
            console.log('Active users updated:', users);
            setActiveUsers(users);
        });

        socketRef.current.on('user_typing', ({ userId, username }) => {
            console.log('User typing:', { userId, username });
            handleUserTyping({ userId, username });
        });

        socketRef.current.on('user_stop_typing', ({ userId }) => {
            console.log('User stopped typing:', userId);
            handleUserStopTyping({ userId });
        });

        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
            setError(error.message);
        });

        return () => {
            console.log('Cleaning up socket connection');
            socketRef.current.emit('leave_room', { roomId, userId: currentUser.id });
            socketRef.current.disconnect();
        };
    }, [roomId, currentUser]);

    const fetchMessages = async () => {
        try {
            console.log('Fetching messages for room:', roomId);
            const response = await fetch(`${SOCKET_URL}/api/chat/rooms/${roomId}/messages`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            console.log('Fetched messages:', data);
            // Sort messages by created_at in ascending order
            const sortedMessages = data.sort((a, b) => 
                new Date(a.created_at) - new Date(b.created_at)
            );
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages');
        }
    };

    const handleNewMessage = (message) => {
        console.log('Adding new message:', message);
        setMessages(prev => [...prev, message]);
        scrollToBottom();
    };

    const handleMessageEdited = (editedMessage) => {
        console.log('Updating edited message:', editedMessage);
        setMessages(prev => prev.map(msg => 
            msg.id === editedMessage.id ? editedMessage : msg
        ));
    };

    const handleMessageDeleted = ({ messageId }) => {
        console.log('Removing deleted message:', messageId);
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    };

    const handleUserJoined = ({ userId, username, activeUsers }) => {
        console.log('Updating active users after join:', activeUsers);
        setActiveUsers(activeUsers);
    };

    const handleUserLeft = ({ userId, activeUsers }) => {
        console.log('Updating active users after leave:', activeUsers);
        setActiveUsers(activeUsers);
        setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
        });
    };

    const handleUserTyping = ({ userId, username }) => {
        console.log('Adding typing user:', { userId, username });
        setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(userId, username);
            return newMap;
        });
    };

    const handleUserStopTyping = ({ userId }) => {
        console.log('Removing typing user:', userId);
        setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (content) => {
        console.log('Sending message:', content);
        if (!content.trim()) return;

        const messageData = {
            roomId,
            message: {
                user_id: currentUser.id,
                content: content.trim()
            }
        };
        console.log('Message data:', messageData);

        socketRef.current.emit('send_message', messageData, (error, savedMessage) => {
            if (error) {
                console.error('Error sending message:', error);
                setError('Failed to send message');
            } else {
                console.log('Message sent successfully:', savedMessage);
            }
        });
    };

    const handleEditMessage = (messageId, content) => {
        console.log('Editing message:', { messageId, content });
        socketRef.current.emit('edit_message', {
            roomId,
            messageId,
            content,
            userId: currentUser.id
        }, (error) => {
            if (error) {
                console.error('Error editing message:', error);
                setError('Failed to edit message');
            }
        });
    };

    const handleDeleteMessage = (messageId) => {
        console.log('Deleting message:', messageId);
        socketRef.current.emit('delete_message', {
            roomId,
            messageId,
            userId: currentUser.id
        }, (error) => {
            if (error) {
                console.error('Error deleting message:', error);
                setError('Failed to delete message');
            }
        });
    };

    const handleReaction = (messageId, reactionType) => {
        console.log('Adding reaction:', { messageId, reactionType });
        socketRef.current.emit('add_reaction', {
            roomId,
            messageId,
            userId: currentUser.id,
            reactionType
        }, (error) => {
            if (error) {
                console.error('Error adding reaction:', error);
                setError('Failed to add reaction');
            }
        });
    };

    const handleRemoveReaction = (messageId, reactionType) => {
        console.log('Removing reaction:', { messageId, reactionType });
        socketRef.current.emit('remove_reaction', {
            roomId,
            messageId,
            userId: currentUser.id,
            reactionType
        }, (error) => {
            if (error) {
                console.error('Error removing reaction:', error);
                setError('Failed to remove reaction');
            }
        });
    };

    console.log('Current messages state:', messages);

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3498db] to-[#2c3e50] text-white">
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <div>
                        <h2 className="text-lg font-semibold">Community Chat</h2>
                        <p className="text-sm text-gray-200 font-mono">Room ID: {roomId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowUsers(!showUsers)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                    >
                        <FaUsers className="w-5 h-5" />
                        {activeUsers.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeUsers.length}
                            </span>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Messages Area */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                        <MessageList
                            messages={messages}
                            currentUser={currentUser}
                            onEditMessage={handleEditMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onReaction={handleReaction}
                            onRemoveReaction={handleRemoveReaction}
                        />
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                        {typingUsers.size > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="px-4 py-2 text-sm text-gray-500 italic bg-gray-50"
                            >
                                {Array.from(typingUsers.values()).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="px-4 py-2 text-sm text-red-500 bg-red-50"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Message Input */}
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        onTyping={() => socketRef.current?.emit('typing', { roomId, userId: currentUser.id, username: currentUser.username })}
                        onStopTyping={() => socketRef.current?.emit('stop_typing', { roomId, userId: currentUser.id })}
                    />
                </div>

                {/* Active Users Sidebar */}
                <AnimatePresence>
                    {showUsers && (
                        <>
                            {/* Mobile Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 md:hidden z-40"
                                onClick={() => setShowUsers(false)}
                            />
                            
                            {/* Users Panel */}
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="fixed md:relative right-0 top-0 h-full w-[280px] bg-white shadow-lg z-50 md:z-0"
                            >
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h3 className="font-semibold text-gray-800">Active Users ({activeUsers.length})</h3>
                                    <button
                                        onClick={() => setShowUsers(false)}
                                        className="p-2 rounded-full hover:bg-gray-100 md:hidden"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <ActiveUsers users={activeUsers} currentUser={currentUser} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatRoom; 