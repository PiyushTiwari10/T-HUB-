const express = require("express");
const pool = require("./db");

const router = express.Router();

// ✅ Get all installation guides
router.get("/installations", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM technologies ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get a single installation guide by ID
router.get("/installations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM technologies WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Installation guide not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Add a new installation guide
router.post("/installations", async (req, res) => {
    try {
        const { name, category, installation_steps, commands, version, troubleshooting } = req.body;

        const result = await pool.query(
            "INSERT INTO technologies (name, category, installation_steps, commands, version, troubleshooting) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, category, installation_steps, commands, version, troubleshooting]
        );

        res.status(201).json({ message: "Installation guide added", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update an installation guide
router.put("/installations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, installation_steps, commands, version, troubleshooting } = req.body;

        const result = await pool.query(
            "UPDATE technologies SET name=$1, category=$2, installation_steps=$3, commands=$4, version=$5, troubleshooting=$6 WHERE id=$7 RETURNING *",
            [name, category, installation_steps, commands, version, troubleshooting, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Installation guide not found" });
        }

        res.json({ message: "Installation guide updated", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete an installation guide
router.delete("/installations/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query("DELETE FROM technologies WHERE id=$1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Installation guide not found" });
        }

        res.json({ message: "Installation guide deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
