// backend/routes/stats.js
const router = require("express").Router();
const db = require("../config/db");

router.get("/", async (_req, res) => {
  try {
    const [[{ count: books }]] = await db.query("SELECT COUNT(*) AS count FROM books");
    const [[{ count: users }]] = await db.query("SELECT COUNT(*) AS count FROM users");
    const [[{ count: transactions }]] = await db.query("SELECT COUNT(*) AS count FROM transactions");

    res.json({ books, users, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
