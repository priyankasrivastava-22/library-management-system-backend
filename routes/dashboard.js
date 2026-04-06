const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.stock,
        s.name AS section,
        c.name AS category,

        COUNT(t.id) AS totalIssued,

        SUM(CASE WHEN t.status = 'issued' THEN 1 ELSE 0 END) AS currentlyIssued,

        SUM(t.fine_amount) AS totalFine

      FROM books b
      LEFT JOIN sections s ON b.section_id = s.id
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN transactions t ON b.id = t.book_id

      GROUP BY b.id
    `);

    res.json(rows);

  } catch (err) {
    console.error("Dashboard API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;