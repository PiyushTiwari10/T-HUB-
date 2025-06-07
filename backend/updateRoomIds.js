const pool = require('./db');

// Function to generate a random 8-character alphanumeric ID
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function updateRoomIds() {
    try {
        // First, add the room_id column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'chat_rooms' 
                    AND column_name = 'room_id'
                ) THEN
                    ALTER TABLE chat_rooms ADD COLUMN room_id VARCHAR(8);
                END IF;
            END $$;
        `);

        // Create index if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 
                    FROM pg_indexes 
                    WHERE indexname = 'idx_chat_rooms_room_id'
                ) THEN
                    CREATE INDEX idx_chat_rooms_room_id ON chat_rooms(room_id);
                END IF;
            END $$;
        `);

        // Get all rooms that don't have a room_id
        const result = await pool.query('SELECT id FROM chat_rooms WHERE room_id IS NULL');
        
        // Update each room with a new unique ID
        for (const row of result.rows) {
            let isUnique = false;
            let roomId;
            
            // Keep generating IDs until we find a unique one
            while (!isUnique) {
                roomId = generateRoomId();
                const checkResult = await pool.query(
                    'SELECT 1 FROM chat_rooms WHERE room_id = $1',
                    [roomId]
                );
                if (checkResult.rows.length === 0) {
                    isUnique = true;
                }
            }
            
            // Update the room with the new ID
            await pool.query(
                'UPDATE chat_rooms SET room_id = $1 WHERE id = $2',
                [roomId, row.id]
            );
            console.log(`Updated room ${row.id} with new ID: ${roomId}`);
        }

        // Make room_id NOT NULL after all rooms have IDs
        await pool.query('ALTER TABLE chat_rooms ALTER COLUMN room_id SET NOT NULL');
        await pool.query('ALTER TABLE chat_rooms ADD CONSTRAINT unique_room_id UNIQUE (room_id)');

        console.log('Successfully updated all room IDs');
    } catch (error) {
        console.error('Error updating room IDs:', error);
    } finally {
        pool.end();
    }
}

updateRoomIds(); 