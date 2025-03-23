require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import database connection
const routes = require('./routes'); // Import routes

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API Home Route
app.get('/', (req, res) => {
    res.send('Tech Stack Installation Hub API is running!');
});

// ✅ Use API Routes
app.use('/api', routes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
