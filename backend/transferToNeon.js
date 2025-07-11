require('dotenv').config();
const pool = require('./db');
const fs = require('fs');
const path = require('path');

const transferTechnologiesToNeon = async () => {
    try {
        console.log('🚀 Starting transfer of technologies to Neon database...');

        // Read the backup file
        const backupPath = path.join(__dirname, 'backups', 'technologies_2025-06-09.json');
        
        if (!fs.existsSync(backupPath)) {
            throw new Error('Backup file not found. Please ensure the backup file exists.');
        }

        const technologiesData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log(`📊 Found ${technologiesData.length} technologies to transfer`);

        // Test database connection
        const client = await pool.connect();
        console.log('✅ Database connection successful');

        // Clear existing data (optional - comment out if you want to keep existing data)
        await pool.query('DELETE FROM technologies');
        console.log('🗑️ Cleared existing technologies data');

        // Insert technologies
        let insertedCount = 0;
        for (const tech of technologiesData) {
            const query = `
                INSERT INTO technologies (
                    id, name, category, installation_steps, commands, 
                    version, troubleshooting, description, download_link, 
                    documentation_link, use_cases, supported_platforms, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    category = EXCLUDED.category,
                    installation_steps = EXCLUDED.installation_steps,
                    commands = EXCLUDED.commands,
                    version = EXCLUDED.version,
                    troubleshooting = EXCLUDED.troubleshooting,
                    description = EXCLUDED.description,
                    download_link = EXCLUDED.download_link,
                    documentation_link = EXCLUDED.documentation_link,
                    use_cases = EXCLUDED.use_cases,
                    supported_platforms = EXCLUDED.supported_platforms,
                    created_at = EXCLUDED.created_at
            `;

            const values = [
                tech.id,
                tech.name,
                tech.category,
                JSON.stringify(tech.installation_steps),
                tech.commands,
                tech.version,
                JSON.stringify(tech.troubleshooting),
                tech.description,
                tech.download_link,
                tech.documentation_link,
                tech.use_cases,
                tech.supported_platforms,
                tech.created_at
            ];

            await pool.query(query, values);
            insertedCount++;
            
            if (insertedCount % 10 === 0) {
                console.log(`📈 Transferred ${insertedCount}/${technologiesData.length} technologies...`);
            }
        }

        console.log(`✅ Successfully transferred ${insertedCount} technologies to Neon database!`);
        
        // Verify the transfer
        const result = await pool.query('SELECT COUNT(*) as count FROM technologies');
        console.log(`📊 Total technologies in database: ${result.rows[0].count}`);

        // Close the client connection
        client.release();
        
    } catch (err) {
        console.error('❌ Error transferring technologies:', err);
        throw err;
    } finally {
        await pool.end();
    }
};

// Run transfer if this file is executed directly
if (require.main === module) {
    transferTechnologiesToNeon()
        .then(() => {
            console.log('🎉 Transfer completed successfully!');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Transfer failed:', err);
            process.exit(1);
        });
}

module.exports = transferTechnologiesToNeon; 