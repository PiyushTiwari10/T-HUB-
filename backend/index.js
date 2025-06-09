require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const pool = require('./db'); // Import database connection
const routes = require('./routes'); // Import routes
const chatRoutes = require('./routes/chatRoutes'); // Import chat routes
const initializeSocket = require('./socket'); // Import socket initialization
const redditRoutes = require('./routes/reddit');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize database tables
const initializeDatabase = async () => {
    try {
        // Create technologies table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS technologies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                installation_steps JSONB,
                commands TEXT,
                version VARCHAR(50),
                troubleshooting JSONB,
                description TEXT,
                download_link VARCHAR(255),
                documentation_link VARCHAR(255),
                use_cases TEXT[],
                supported_platforms TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create chat_rooms table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS chat_rooms (
                id SERIAL PRIMARY KEY,
                room_id VARCHAR(8) UNIQUE NOT NULL,
                technology_id INTEGER REFERENCES technologies(id),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT true
            );
        `);

        // Create messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                chat_room_id INTEGER REFERENCES chat_rooms(id),
                user_id VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_edited BOOLEAN DEFAULT false,
                edited_at TIMESTAMP,
                parent_message_id INTEGER REFERENCES messages(id),
                username VARCHAR(255)
            );
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing database tables:', err);
    }
};

// Initialize database before starting the server
initializeDatabase().then(() => {
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/api', routes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/reddit', redditRoutes);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start server
    const PORT = process.env.PORT || 10000;
    server.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
});
