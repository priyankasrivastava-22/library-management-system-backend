// backend/routes/transactions.js
const router = require("express").Router();
const db = require("../config/db");

// list transactions (join users & books for names)
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        u.name AS user,
        b.title AS book,
        t.status,
        t.issued_at,
        t.due_at,
        t.returned_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN books b ON t.book_id = b.id
      ORDER BY t.issued_at DESC
      LIMIT 200
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

module.exports = router;
