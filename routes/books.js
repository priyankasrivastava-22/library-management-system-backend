// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");
// const bookController = require("../controllers/bookController");

// // get all books
// router.get("/", bookController.getBooks);

// // add book
// router.post("/", bookController.addBook);

// // delete book
// router.delete("/:id", bookController.deleteBook);

// // get all sections
// router.get("/sections", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM sections");
//     res.json(rows);
//   } catch (err) {
//     console.error("Sections API Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // get all categories
// router.get("/categories", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM categories");
//     res.json(rows);
//   } catch (err) {
//     console.error("Categories API Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Get all books
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM books');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Add a new book
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

// 3. Delete a book (This was likely where the line 13 error occurred)
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