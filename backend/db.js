// Load .env file
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render's PostgreSQL
  }
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
