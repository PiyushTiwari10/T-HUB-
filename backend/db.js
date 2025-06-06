require("dotenv").config(); // Load .env file
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: false, // Disable SSL for local setup
});

// Add username column to messages table if it doesn't exist
pool.query(`
    DO $$ 
    BEGIN 
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'messages' 
            AND column_name = 'username'
        ) THEN
            ALTER TABLE messages ADD COLUMN username VARCHAR(255);
        END IF;
    END $$;
`).catch(err => console.error("Error adding username column:", err));

pool.connect()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch(err => console.error("❌ Database connection failed:", err));

module.exports = pool;
