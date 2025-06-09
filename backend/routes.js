const express = require("express");
const pool = require("./db");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "API is healthy", timestamp: new Date().toISOString() });
});

// Check database table structure
router.get("/installations/structure", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'technologies'
            ORDER BY ordinal_position;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error checking table structure:', err);
        res.status(500).json({ 
            error: err.message,
            details: 'Failed to check table structure'
        });
    }
});

// Get all installation guides
router.get("/installations", async (req, res) => {
    try {
        console.log('Fetching all technologies...');
        const result = await pool.query("SELECT * FROM technologies ORDER BY created_at DESC");
        console.log(`Found ${result.rows.length} technologies`);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching technologies:', err);
        res.status(500).json({ 
            error: err.message,
            details: 'Failed to fetch technologies from database'
        });
    }
});

// Get single installation guide
router.get("/installations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM technologies WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technology not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching technology:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add new installation guide
router.post("/installations", async (req, res) => {
    try {
        const { 
            name, 
            category, 
            installation_steps, 
            commands, 
            version, 
            troubleshooting,
            description,
            download_link,
            documentation_link,
            use_cases,
            supported_platforms
        } = req.body;

        const result = await pool.query(
            `INSERT INTO technologies (
                name, category, installation_steps, commands, version, 
                troubleshooting, description, download_link, documentation_link,
                use_cases, supported_platforms
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [
                name, category, installation_steps, commands, version,
                troubleshooting, description, download_link, documentation_link,
                use_cases, supported_platforms
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding technology:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add test technology
router.post("/installations/test", async (req, res) => {
    try {
        const testTech = {
            name: "Test Technology",
            description: "This is a test technology",
            category: "Testing",
            installation_steps: JSON.stringify({
                steps: [
                    "Step 1: Install dependencies",
                    "Step 2: Configure settings"
                ]
            }),
            commands: "npm install\nnpm start",
            version: "1.0.0",
            troubleshooting: JSON.stringify({
                common_issues: [
                    "Issue 1: Check dependencies",
                    "Issue 2: Verify configuration"
                ]
            }),
            download_link: "https://example.com/download",
            documentation_link: "https://example.com/docs",
            use_cases: ["Testing", "Development"],
            supported_platforms: ["Windows", "Linux", "MacOS"]
        };

        const result = await pool.query(
            `INSERT INTO technologies (
                name, category, installation_steps, commands, version, 
                troubleshooting, description, download_link, documentation_link,
                use_cases, supported_platforms
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [
                testTech.name, testTech.category, testTech.installation_steps,
                testTech.commands, testTech.version, testTech.troubleshooting,
                testTech.description, testTech.download_link, testTech.documentation_link,
                testTech.use_cases, testTech.supported_platforms
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding test technology:', err);
        res.status(500).json({ 
            error: err.message,
            details: 'Failed to add test technology'
        });
    }
});

// Update installation guide
router.put("/installations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            category, 
            installation_steps, 
            commands, 
            version, 
            troubleshooting,
            description,
            download_link,
            documentation_link,
            use_cases,
            supported_platforms
        } = req.body;

        const result = await pool.query(
            `UPDATE technologies 
            SET name = $1, category = $2, installation_steps = $3, 
                commands = $4, version = $5, troubleshooting = $6,
                description = $7, download_link = $8, documentation_link = $9,
                use_cases = $10, supported_platforms = $11
            WHERE id = $12 
            RETURNING *`,
            [
                name, category, installation_steps, commands, version,
                troubleshooting, description, download_link, documentation_link,
                use_cases, supported_platforms, id
            ]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technology not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating technology:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete installation guide
router.delete("/installations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM technologies WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technology not found" });
        }
        
        res.json({ message: "Technology deleted successfully" });
    } catch (err) {
        console.error('Error deleting technology:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
