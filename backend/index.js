require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const pool = require('./db'); // Import database connection
const routes = require('./routes'); // Import routes
const chatRoutes = require('./routes/chatRoutes'); // Import chat routes
const initializeSocket = require('./socket'); // Import socket initialization

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

app.use(cors());
app.use(express.json());

// ✅ API Home Route
app.get('/', (req, res) => {
    res.send('Tech Stack Installation Hub API is running!');
});

// ✅ Use API Routes
app.use('/api', routes);
app.use('/api/chat', chatRoutes); // Add chat routes

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
