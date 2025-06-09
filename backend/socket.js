const { Server } = require('socket.io');
const pool = require('./db');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                'https://t-hub-17jm.onrender.com',
                'https://t-hub-five.vercel.app',
                process.env.FRONTEND_URL
            ].filter(Boolean),
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Store active users in each room
    const activeUsers = new Map();

    // Function to ensure chat room exists
    async function ensureChatRoom(roomId) {
        try {
            // Check if room exists
            const roomResult = await pool.query(
                'SELECT id FROM chat_rooms WHERE room_id = $1',
                [roomId]
            );

            if (roomResult.rows.length === 0) {
                // Create room if it doesn't exist
                const newRoomResult = await pool.query(
                    'INSERT INTO chat_rooms (room_id, name) VALUES ($1, $2) RETURNING id',
                    [roomId, `Chat Room ${roomId}`]
                );
                console.log(`Created new chat room: ${roomId}`);
                return newRoomResult.rows[0].id;
            }

            return roomResult.rows[0].id;
        } catch (error) {
            console.error('Error ensuring chat room exists:', error);
            throw error;
        }
    }

    // Function to add user to chat room members
    async function addUserToRoom(roomId, userId, username) {
        try {
            const chatRoomId = await ensureChatRoom(roomId);
            await pool.query(
                'INSERT INTO chat_room_members (chat_room_id, user_id, username) VALUES ($1, $2, $3) ON CONFLICT (chat_room_id, user_id) DO UPDATE SET username = $3',
                [chatRoomId, userId, username]
            );
        } catch (error) {
            console.error('Error adding user to room:', error);
            throw error;
        }
    }

    // Function to remove user from chat room members
    async function removeUserFromRoom(roomId, userId) {
        try {
            const chatRoomId = await ensureChatRoom(roomId);
            await pool.query(
                'DELETE FROM chat_room_members WHERE chat_room_id = $1 AND user_id = $2',
                [chatRoomId, userId]
            );
        } catch (error) {
            console.error('Error removing user from room:', error);
            throw error;
        }
    }

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a chat room
        socket.on('join_room', async ({ roomId, userId, username }, callback) => {
            try {
                // Ensure chat room exists before joining
                await ensureChatRoom(roomId);
                
                // Add user to room members in database
                await addUserToRoom(roomId, userId, username);
                
                socket.join(roomId);
                
                // Add user to active users in the room
                if (!activeUsers.has(roomId)) {
                    activeUsers.set(roomId, new Map());
                }
                activeUsers.get(roomId).set(socket.id, { userId, username });
                
                // Notify others that user joined
                socket.to(roomId).emit('user_joined', {
                    userId,
                    username,
                    activeUsers: Array.from(activeUsers.get(roomId).values())
                });

                // Send current active users to the new user
                socket.emit('active_users', Array.from(activeUsers.get(roomId).values()));
                
                if (callback) callback(null, { success: true });
            } catch (error) {
                console.error('Error joining room:', error);
                if (callback) callback({ message: 'Failed to join room' });
            }
        });

        // Leave a chat room
        socket.on('leave_room', async ({ roomId, userId }, callback) => {
            try {
                socket.leave(roomId);
                
                // Remove user from active users
                if (activeUsers.has(roomId)) {
                    activeUsers.get(roomId).delete(socket.id);
                    
                    // Remove user from room members in database
                    await removeUserFromRoom(roomId, userId);
                    
                    // Notify others that user left
                    socket.to(roomId).emit('user_left', {
                        userId,
                        activeUsers: Array.from(activeUsers.get(roomId).values())
                    });
                }
                
                if (callback) callback(null, { success: true });
            } catch (error) {
                console.error('Error leaving room:', error);
                if (callback) callback({ message: 'Failed to leave room' });
            }
        });

        // Send a message
        socket.on('send_message', async ({ roomId, message }, callback) => {
            try {
                // Ensure chat room exists and get its ID
                const chatRoomId = await ensureChatRoom(roomId);

                // Get username from active users
                const username = activeUsers.get(roomId)?.get(socket.id)?.username;

                // Save message to database
                const result = await pool.query(
                    'INSERT INTO messages (chat_room_id, user_id, content, username) VALUES ($1, $2, $3, $4) RETURNING *',
                    [chatRoomId, message.user_id, message.content, username]
                );

                const savedMessage = result.rows[0];
                
                // Broadcast message to all users in the room
                io.to(roomId).emit('new_message', savedMessage);
                
                if (callback) callback(null, savedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
                if (callback) callback({ message: 'Failed to send message' });
            }
        });

        // Edit a message
        socket.on('edit_message', async ({ roomId, messageId, content, userId }, callback) => {
            try {
                const result = await pool.query(
                    'UPDATE messages SET content = $1, is_edited = true, edited_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                    [content, messageId, userId]
                );

                if (result.rows.length > 0) {
                    io.to(roomId).emit('message_edited', result.rows[0]);
                    if (callback) callback(null, result.rows[0]);
                } else {
                    if (callback) callback({ message: 'Message not found or unauthorized' });
                }
            } catch (error) {
                console.error('Error editing message:', error);
                if (callback) callback({ message: 'Failed to edit message' });
            }
        });

        // Delete a message
        socket.on('delete_message', async ({ roomId, messageId, userId }, callback) => {
            try {
                const result = await pool.query(
                    'DELETE FROM messages WHERE id = $1 AND user_id = $2 RETURNING *',
                    [messageId, userId]
                );

                if (result.rows.length > 0) {
                    io.to(roomId).emit('message_deleted', { messageId });
                    if (callback) callback(null, { success: true });
                } else {
                    if (callback) callback({ message: 'Message not found or unauthorized' });
                }
            } catch (error) {
                console.error('Error deleting message:', error);
                if (callback) callback({ message: 'Failed to delete message' });
            }
        });

        // Add reaction to message
        socket.on('add_reaction', async ({ roomId, messageId, userId, reactionType }, callback) => {
            try {
                const result = await pool.query(
                    'INSERT INTO message_reactions (message_id, user_id, reaction_type) VALUES ($1, $2, $3) RETURNING *',
                    [messageId, userId, reactionType]
                );

                io.to(roomId).emit('reaction_added', {
                    messageId,
                    reaction: result.rows[0]
                });
                
                if (callback) callback(null, result.rows[0]);
            } catch (error) {
                console.error('Error adding reaction:', error);
                if (callback) callback({ message: 'Failed to add reaction' });
            }
        });

        // Remove reaction from message
        socket.on('remove_reaction', async ({ roomId, messageId, userId, reactionType }, callback) => {
            try {
                const result = await pool.query(
                    'DELETE FROM message_reactions WHERE message_id = $1 AND user_id = $2 AND reaction_type = $3 RETURNING *',
                    [messageId, userId, reactionType]
                );

                if (result.rows.length > 0) {
                    io.to(roomId).emit('reaction_removed', {
                        messageId,
                        reactionType
                    });
                    if (callback) callback(null, { success: true });
                } else {
                    if (callback) callback({ message: 'Reaction not found' });
                }
            } catch (error) {
                console.error('Error removing reaction:', error);
                if (callback) callback({ message: 'Failed to remove reaction' });
            }
        });

        // Typing indicator
        socket.on('typing', ({ roomId, userId, username }, callback) => {
            try {
                socket.to(roomId).emit('user_typing', { userId, username });
                if (callback) callback(null, { success: true });
            } catch (error) {
                console.error('Error sending typing indicator:', error);
                if (callback) callback({ message: 'Failed to send typing indicator' });
            }
        });

        socket.on('stop_typing', ({ roomId, userId }, callback) => {
            try {
                socket.to(roomId).emit('user_stop_typing', { userId });
                if (callback) callback(null, { success: true });
            } catch (error) {
                console.error('Error stopping typing indicator:', error);
                if (callback) callback({ message: 'Failed to stop typing indicator' });
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            
            // Remove user from all rooms they were in
            for (const [roomId, users] of activeUsers.entries()) {
                if (users.has(socket.id)) {
                    const user = users.get(socket.id);
                    users.delete(socket.id);
                    
                    try {
                        // Remove user from room members in database
                        await removeUserFromRoom(roomId, user.userId);
                        
                        // Notify others that user left
                        io.to(roomId).emit('user_left', {
                            userId: user.userId,
                            activeUsers: Array.from(users.values())
                        });
                    } catch (error) {
                        console.error('Error handling user disconnect:', error);
                    }
                }
            }
        });
    });

    return io;
}

module.exports = initializeSocket; 