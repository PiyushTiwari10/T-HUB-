const express = require('express');
const router = express.Router();
const pool = require('../db');

// Function to generate a random 8-character alphanumeric ID
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Get all chat rooms with active user counts
router.get('/rooms', async (req, res) => {
    try {
        const { search } = req.query;
        let query = `
            SELECT cr.*, 
                    (SELECT COUNT(*) FROM chat_room_members WHERE chat_room_id = cr.id) as active_users
             FROM chat_rooms cr 
             WHERE cr.is_active = true
        `;
        const params = [];

        if (search) {
            query += ` AND (cr.room_id ILIKE $1 OR cr.name ILIKE $1)`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY cr.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get chat rooms for a specific technology
router.get('/rooms/tech/:techId', async (req, res) => {
    try {
        const { techId } = req.params;
        const { search } = req.query;
        let query = 'SELECT * FROM chat_rooms WHERE technology_id = $1 AND is_active = true';
        const params = [techId];

        if (search) {
            query += ` AND (room_id ILIKE $2 OR name ILIKE $2)`;
            params.push(`%${search}%`);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new chat room
router.post('/rooms', async (req, res) => {
    try {
        const { technology_id, name, description } = req.body;
        const room_id = generateRoomId();
        
        const result = await pool.query(
            'INSERT INTO chat_rooms (room_id, technology_id, name, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [room_id, technology_id, name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get messages for a chat room
router.get('/rooms/:roomId/messages', async (req, res) => {
    try {
        const { roomId } = req.params;
        const result = await pool.query(
            `SELECT m.*, 
                    (SELECT COUNT(*) FROM message_reactions WHERE message_id = m.id) as reaction_count
             FROM messages m 
             WHERE m.chat_room_id = $1 
             ORDER BY m.created_at ASC 
             LIMIT 50`,
            [roomId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send a new message
router.post('/rooms/:roomId/messages', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { user_id, content, parent_message_id } = req.body;
        
        const result = await pool.query(
            'INSERT INTO messages (chat_room_id, user_id, content, parent_message_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [roomId, user_id, content, parent_message_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit a message
router.put('/messages/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content, user_id } = req.body;
        
        const result = await pool.query(
            'UPDATE messages SET content = $1, is_edited = true, edited_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
            [content, messageId, user_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found or unauthorized' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a message
router.delete('/messages/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { user_id } = req.body;
        
        const result = await pool.query(
            'DELETE FROM messages WHERE id = $1 AND user_id = $2 RETURNING *',
            [messageId, user_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found or unauthorized' });
        }
        
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a reaction to a message
router.post('/messages/:messageId/reactions', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { user_id, reaction_type } = req.body;
        
        const result = await pool.query(
            'INSERT INTO message_reactions (message_id, user_id, reaction_type) VALUES ($1, $2, $3) RETURNING *',
            [messageId, user_id, reaction_type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove a reaction from a message
router.delete('/messages/:messageId/reactions', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { user_id, reaction_type } = req.body;
        
        const result = await pool.query(
            'DELETE FROM message_reactions WHERE message_id = $1 AND user_id = $2 AND reaction_type = $3 RETURNING *',
            [messageId, user_id, reaction_type]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reaction not found' });
        }
        
        res.json({ message: 'Reaction removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 