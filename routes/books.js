// backend/routes/books.js
const router = require("express").Router();
const db = require("../config/db");

// list books
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, author, category, stock FROM books ORDER BY id DESC LIMIT 200"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

module.exports = router;
