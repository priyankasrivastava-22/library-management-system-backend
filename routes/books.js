const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Get books - Simplified (Pagination Removed)
router.get('/', async (req, res) => {
    try {
        /**
         * SQL logic: 
         * removed LIMIT and OFFSET to return every book in the database.
         * 2. LEFT JOIN is still used so the frontend can see section and category names.
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

        // wrap the result in an object { books: rows } 
        // so frontend code (.then(data => data.books)) stays working.
        res.json({
            books: rows,
            totalBooks: rows.length
        });
    } catch (err) {
        console.error("GET /api/books Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Add a new book - (Kept exactly as is)
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

// 3. Delete a book - (Kept exactly as is)
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