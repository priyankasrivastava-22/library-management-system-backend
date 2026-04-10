const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Get all books - UPDATED for Student Frontend compatibility
router.get('/', async (req, res) => {
    try {
        /**
         * Used  LEFT JOIN to fetch the human-readable names of sections and categories.
         * 'b.*' ensures the Admin Dashboard still gets all the original ID fields it expects.
         * 's.name AS section' allows the Student Frontend to filter by "Fiction", "Study", etc.
         */
        const [rows] = await db.query(`
            SELECT 
                b.*, 
                s.name AS section, 
                c.name AS category 
            FROM books b
            LEFT JOIN sections s ON b.section_id = s.id
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.id DESC
        `);
        res.json(rows);
    } catch (err) {
        // Detailed error logging helps if the database connection drops
        console.error("GET /api/books Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Add a new book - (Kept exactly as is for Admin Dashboard)
router.post('/', async (req, res) => {
    const { title, author, publisher, stock, section_id, category_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO books (title, author, publisher, stock, section_id, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, author, publisher, stock, section_id, category_id]
        );
        res.status(201).json({ id: result.insertId, message: "Book added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete a book - (Kept exactly as is for Admin Dashboard)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete book" });
    }
});

module.exports = router;