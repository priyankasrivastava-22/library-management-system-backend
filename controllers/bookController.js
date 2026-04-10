// const db = require("../config/db");

// // ================= GET BOOKS =================
// exports.getBooks = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         b.id,
//         b.title,
//         b.author,
//         b.publisher,
//         b.stock,
//         s.name AS section,
//         c.name AS category
//       FROM books b
//       JOIN sections s ON b.section_id = s.id
//       JOIN categories c ON b.category_id = c.id
//       ORDER BY b.id DESC
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error("GET BOOKS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ================= ADD BOOK =================
// exports.addBook = async (req, res) => {
//   const { section_id, category_id, title, author, publisher, stock } = req.body;

//   try {
//     if (!section_id || !category_id || !title || !author) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const [result] = await db.query(
//       `INSERT INTO books 
//        (section_id, category_id, title, author, publisher, stock, approved, review)
//        VALUES (?, ?, ?, ?, ?, ?, 1, '')`,
//       [section_id, category_id, title, author, publisher, stock]
//     );

//     res.json({
//       message: "Book added successfully",
//       id: result.insertId,
//     });

//   } catch (err) {
//     console.error("ADD BOOK ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ================= DELETE =================
// exports.deleteBook = async (req, res) => {
//   try {
//     await db.query("DELETE FROM books WHERE id = ?", [req.params.id]);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


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