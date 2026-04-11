const db = require("../config/db");

// I'm using JOINs here so the student frontend gets the actual names of sections/categories
exports.getBooks = async (req, res) => {
  const { category } = req.query; // If the student app asks for a specific category
  try {
    let sql = `
      SELECT b.*, s.name AS section_name, c.name AS category_name 
      FROM books b
      JOIN sections s ON b.section_id = s.id
      JOIN categories c ON b.category_id = c.id
    `;
    const params = [];

    if (category) {
      sql += " WHERE c.name = ?";
      params.push(category);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This handles adding the book from my Admin Records page
exports.addBook = async (req, res) => {
  const { title, author, publisher, stock, section_id, category_id, review } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO books (title, author, publisher, stock, section_id, category_id, review) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, author, publisher, stock, section_id, category_id, review]
    );
    res.json({ message: "Book added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};