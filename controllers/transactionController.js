const db = require("../config/db");

const MAX_BOOKS = 6;
const FINE_PER_DAY = 5;

// Issue a book
exports.issueBook = async (req, res) => {
  const { userId, bookId, adminId } = req.body;

  try {
    // checking if book exists and stock is available
    const [book] = await db.query("SELECT stock FROM books WHERE id=?", [bookId]);

    if (book.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book[0].stock <= 0) {
      return res.status(400).json({ error: "Out of stock" });
    }

    // calculating return date (7 days from issue date)
    const issueDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(issueDate.getDate() + 7);

    // inserting transaction record
    await db.query(
      `INSERT INTO transactions 
       (user_id, book_id, admin_id, issued_at, return_date, status) 
       VALUES (?, ?, ?, NOW(), ?, 'issued')`,
      [userId, bookId, adminId, returnDate]
    );

    // reducing book stock
    await db.query("UPDATE books SET stock = stock - 1 WHERE id=?", [bookId]);

    res.json({ message: "Book issued successfully", returnDate });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    // getting latest issued transaction
    const [rows] = await db.query(`
      SELECT * FROM transactions 
      WHERE user_id=? AND book_id=? AND status='issued'
      ORDER BY issued_at DESC LIMIT 1
    `, [userId, bookId]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "No active issue found" });
    }

    const transaction = rows[0];

    const today = new Date();
    const returnDate = new Date(transaction.return_date);

    let fine = 0;
    let status = "returned";

    // calculating fine if late
    if (today > returnDate) {
      const diffDays = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
      fine = diffDays * FINE_PER_DAY;
      status = "late";
    }

    // updating transaction
    await db.query(`
      UPDATE transactions 
      SET actual_return_date = NOW(), fine_amount = ?, status = ?
      WHERE id=?
    `, [fine, status, transaction.id]);

    // increasing book stock
    await db.query("UPDATE books SET stock = stock + 1 WHERE id=?", [bookId]);

    res.json({ message: "Book returned", fine, status });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions (for admin dashboard)
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        u.name AS student_name,
        b.id AS book_id,
        b.title,
        b.author,
        t.issued_at,
        t.return_date,
        t.actual_return_date,
        t.status,
        t.fine_amount,
        t.review,
        a.name AS admin_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN books b ON t.book_id = b.id
      LEFT JOIN admins a ON t.admin_id = a.id
      ORDER BY t.issued_at DESC
    `);

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get transactions for a specific user (for student frontend "My Books")
exports.getUserTransactions = async (req, res) => {
  const { userId } = req.params;

  try {
    // fetching all books issued to a user
    const [rows] = await db.query(`
      SELECT 
        t.id,
        b.title,
        b.author,
        t.issued_at,
        t.return_date,
        t.actual_return_date,
        t.status,
        t.fine_amount,
        t.review
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      WHERE t.user_id=?
      ORDER BY t.issued_at DESC
    `, [userId]);

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add review for a transaction (student gives review)
exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  try {
    // updating review for a transaction
    await db.query(
      "UPDATE transactions SET review=? WHERE id=?",
      [review, id]
    );

    res.json({ message: "Review added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};