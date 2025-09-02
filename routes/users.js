// backend/routes/users.js
const router = require("express").Router();
const db = require("../config/db");

router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users ORDER BY id DESC LIMIT 200"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
