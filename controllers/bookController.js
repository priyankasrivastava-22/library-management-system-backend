const db = require("../config/db");

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, b.author, b.publisher, b.stock, b.approved, b.review,
             s.name AS section, c.name AS category
      FROM books b
      JOIN sections s ON b.section_id = s.id
      JOIN categories c ON b.category_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add book
exports.addBook = async (req, res) => {
  const { section_id, category_id, title, author, publisher, stock } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO books (section_id, category_id, title, author, publisher, stock) VALUES (?, ?, ?, ?, ?, ?)",
      [section_id, category_id, title, author, publisher, stock]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
