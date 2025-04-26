const pool = require('./db');

const createTables = async () => {
    const query = `
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
    `;

    try {
        await pool.query(query);
        console.log('Database tables created successfully!');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        pool.end();
    }
};

createTables();
