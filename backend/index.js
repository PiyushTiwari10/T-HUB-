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
const allowedOrigins = [
    'http://localhost:3000',
    'https://t-hub-17jm.onrender.com',
    'https://t-hub-five.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({ 
        status: "ok", 
        message: "T-HUB API is running",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            installations: "/api/installations",
            chat: "/api/chat",
            reddit: "/api/reddit"
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: "ok", 
        message: "API is healthy",
        timestamp: new Date().toISOString()
    });
});

// Initialize database tables
const initializeDatabase = async () => {
    try {
        // Create technologies table first
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
        console.log('✅ Technologies table created/verified');

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
        console.log('✅ Chat rooms table created/verified');

        // Create messages table with username column included
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                chat_room_id INTEGER REFERENCES chat_rooms(id),
                user_id VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                username VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_edited BOOLEAN DEFAULT false,
                edited_at TIMESTAMP,
                parent_message_id INTEGER REFERENCES messages(id)
            );
        `);
        console.log('✅ Messages table created/verified');

        console.log('✅ All database tables initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing database tables:', err);
        throw err; // Re-throw to prevent server start if DB init fails
    }
};

// Initialize database before starting the server
initializeDatabase()
    .then(() => {
        // API Routes
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
    })
    .catch(err => {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1); // Exit if database initialization fails
    });
