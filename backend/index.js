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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Home Route
app.get('/', (req, res) => {
    res.send('Tech Stack Installation Hub API is running!');
});

// ✅ Use API Routes
app.use('/api', routes);
app.use('/api/chat', chatRoutes); // Add chat routes
app.use('/api/reddit', redditRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Initialize Socket.IO
initializeSocket(server);
