import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ActiveUsers from './ActiveUsers';

const ChatRoom = ({ roomId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Map());
    const [error, setError] = useState(null);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log('ChatRoom mounted with:', { roomId, currentUser });
        
        // Initialize socket connection
        socketRef.current = io('http://localhost:5000', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
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
            const response = await fetch(`http://localhost:5000/api/chat/rooms/${roomId}/messages`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            console.log('Fetched messages:', data);
            setMessages(data);
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
        <div className="flex h-full bg-gray-100">
            {error && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
                    {error}
                </div>
            )}
            <div className="flex w-full bg-white shadow-lg">
                <ActiveUsers users={activeUsers} />
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto">
                        <MessageList
                            messages={messages}
                            currentUser={currentUser}
                            onEditMessage={handleEditMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onReaction={handleReaction}
                            onRemoveReaction={handleRemoveReaction}
                        />
                        <div ref={messagesEndRef} />
                        {typingUsers.size > 0 && (
                            <div className="text-sm text-gray-500 italic p-2">
                                {Array.from(typingUsers.values()).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                            </div>
                        )}
                    </div>
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        onTyping={() => socketRef.current.emit('typing', { roomId, userId: currentUser.id, username: currentUser.username })}
                        onStopTyping={() => socketRef.current.emit('stop_typing', { roomId, userId: currentUser.id })}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatRoom; 