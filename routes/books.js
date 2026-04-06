const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bookController = require("../controllers/bookController");

// get all books
router.get("/", bookController.getBooks);

// add book
router.post("/", bookController.addBook);

// delete book
router.delete("/:id", bookController.deleteBook);

// get all sections
router.get("/sections", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sections");
    res.json(rows);
  } catch (err) {
    console.error("Sections API Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// get all categories
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    console.error("Categories API Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;