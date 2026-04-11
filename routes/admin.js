// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your database connection

// Fetch all sections
router.get('/sections', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM sections');
        res.status(200).json(rows);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to fetch sections" });
    }
});

// Fetch categories based on section ID
router.get('/categories/:sectionId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories WHERE section_id = ?', [req.params.sectionId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

module.exports = router;

