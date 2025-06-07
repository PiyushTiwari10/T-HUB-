const pool = require('./db');

const createChatTables = async () => {
    const queries = [
        // Chat Rooms Table
        `CREATE TABLE IF NOT EXISTS chat_rooms (
            id SERIAL PRIMARY KEY,
            room_id VARCHAR(8) UNIQUE NOT NULL,
            technology_id INTEGER REFERENCES technologies(id),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT true
        )`,
        `CREATE INDEX IF NOT EXISTS idx_chat_rooms_room_id ON chat_rooms(room_id)`,

        // Messages Table
        `CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            chat_room_id INTEGER REFERENCES chat_rooms(id),
            user_id VARCHAR(255) NOT NULL, -- Store Supabase user ID as string
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_edited BOOLEAN DEFAULT false,
            edited_at TIMESTAMP,
            parent_message_id INTEGER REFERENCES messages(id)
        )`,

        // Chat Room Members Table
        `CREATE TABLE IF NOT EXISTS chat_room_members (
            id SERIAL PRIMARY KEY,
            chat_room_id INTEGER REFERENCES chat_rooms(id),
            user_id VARCHAR(255) NOT NULL, -- Store Supabase user ID as string
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            role VARCHAR(50) DEFAULT 'member',
            UNIQUE(chat_room_id, user_id)
        )`,

        // Message Reactions Table
        `CREATE TABLE IF NOT EXISTS message_reactions (
            id SERIAL PRIMARY KEY,
            message_id INTEGER REFERENCES messages(id),
            user_id VARCHAR(255) NOT NULL, -- Store Supabase user ID as string
            reaction_type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(message_id, user_id, reaction_type)
        )`,

        // Message Attachments Table
        `CREATE TABLE IF NOT EXISTS message_attachments (
            id SERIAL PRIMARY KEY,
            message_id INTEGER REFERENCES messages(id),
            file_name VARCHAR(255) NOT NULL,
            file_type VARCHAR(100) NOT NULL,
            file_url TEXT NOT NULL,
            file_size INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    try {
        for (const query of queries) {
            await pool.query(query);
            console.log('Successfully executed query');
        }
        console.log('All chat system tables created successfully!');
    } catch (err) {
        console.error('Error creating chat tables:', err);
    } finally {
        pool.end();
    }
};

createChatTables(); 