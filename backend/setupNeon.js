require('dotenv').config();
const pool = require('./db');
const createChatTables = require('./chatMigrations');

const setupNeonDatabase = async () => {
    try {
        console.log('🚀 Setting up Neon database...');

        // Test connection
        const client = await pool.connect();
        console.log('✅ Database connection successful');

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
        console.log('✅ Technologies table created/verified');

        // Create chat tables
        await createChatTables();
        console.log('✅ Chat tables created/verified');

        console.log('🎉 Neon database setup completed successfully!');
        
        // Close the client connection
        client.release();
        
    } catch (err) {
        console.error('❌ Error setting up Neon database:', err);
        throw err;
    } finally {
        await pool.end();
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setupNeonDatabase()
        .then(() => {
            console.log('✅ Setup completed successfully');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Setup failed:', err);
            process.exit(1);
        });
}

module.exports = setupNeonDatabase; 