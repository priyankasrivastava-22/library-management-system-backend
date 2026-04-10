const db = require("../config/db");

// UPDATED: Student can only have 5 books in total
const MAX_BOOKS = 5; 
const FINE_PER_DAY = 5;

// 1. Issue a book
exports.issueBook = async (req, res) => {
  const { userId, bookId, adminId } = req.body;

  try {
    // RULE A: Check if the student already has 5 books issued (Status = 'issued')
    const [activeCount] = await db.query(
      "SELECT COUNT(*) AS count FROM transactions WHERE user_id = ? AND status = 'issued'",
      [userId]
    );

    if (activeCount[0].count >= MAX_BOOKS) {
      return res.status(400).json({ error: `Limit reached. You can only have ${MAX_BOOKS} books issued at a time.` });
    }

    // RULE B: Check if the student already has THIS specific book issued
    const [alreadyHas] = await db.query(
      "SELECT * FROM transactions WHERE user_id = ? AND book_id = ? AND status = 'issued'",
      [userId, bookId]
    );

    if (alreadyHas.length > 0) {
      return res.status(400).json({ error: "You already have a copy of this book." });
    }

    // RULE C: Check stock availability
    const [book] = await db.query("SELECT stock FROM books WHERE id=?", [bookId]);
    if (book.length === 0 || book[0].stock <= 0) {
      return res.status(400).json({ error: "Out of stock" });
    }

    // Calculation: Set return date (e.g., 14 days from now)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);

    // Proceed to issue
    await db.query(
      `INSERT INTO transactions 
       (user_id, book_id, admin_id, issued_at, return_date, status) 
       VALUES (?, ?, ?, NOW(), ?, 'issued')`,
      [userId, bookId, adminId || null, returnDate]
    );

    // Reduce stock
    await db.query("UPDATE books SET stock = stock - 1 WHERE id=?", [bookId]);

    res.json({ message: "Book issued successfully", returnDate });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Return a book
exports.returnBook = async (req, res) => {
  const { transactionId } = req.body; // Using Transaction ID is safer

  try {
    const [rows] = await db.query("SELECT * FROM transactions WHERE id=?", [transactionId]);
    if (rows.length === 0) return res.status(404).json({ error: "Transaction not found" });

    const transaction = rows[0];
    const today = new Date();
    const dueDate = new Date(transaction.return_date);

    let fine = 0;
    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * FINE_PER_DAY;
    }

    await db.query(
      "UPDATE transactions SET actual_return_date = NOW(), fine_amount = ?, status = 'returned' WHERE id=?",
      [fine, transactionId]
    );

    // Increase stock back
    await db.query("UPDATE books SET stock = stock + 1 WHERE id=?", [transaction.book_id]);

    res.json({ message: "Book returned", fine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get transactions for specific user (FOR YOUR STATUS DROPDOWN)
exports.getUserTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        b.title,
        b.publisher,
        b.author,
        t.issued_at,
        t.return_date,
        t.status,
        t.fine_amount
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      WHERE t.user_id = ? AND t.status = 'issued'
      ORDER BY t.issued_at DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get all (for Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, u.name AS student_name, b.title 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      JOIN books b ON t.book_id = b.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Add Review
exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  try {
    await db.query("UPDATE transactions SET review=? WHERE id=?", [review, id]);
    res.json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};