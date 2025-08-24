const db = require("../config/db");

const MAX_BOOKS = 6;
const FINE_PER_DAY = 5;

// Issue a book
exports.issueBook = (req, res) => {
    const { userId, bookId } = req.body;

    // Check user cart limit
    const checkSql = `
    SELECT COUNT(*) AS count 
    FROM transactions 
    WHERE user_id=? AND type='Issue' 
      AND id NOT IN (SELECT id FROM transactions WHERE type='Return')`;

    db.query(checkSql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result[0].count >= MAX_BOOKS)
            return res.status(400).json({ error: "Cart limit exceeded. Only 6 books allowed." });

        // Check stock
        const bookSql = "SELECT quantity FROM books WHERE id=?";
        db.query(bookSql, [bookId], (err2, bookResult) => {
            if (err2) return res.status(500).json({ error: err2 });
            if (!bookResult.length) return res.status(404).json({ error: "Book not found" });
            if (bookResult[0].quantity <= 0) return res.status(400).json({ error: "Book out of stock" });

            // Issue book
            const issueSql = "INSERT INTO transactions (user_id, book_id, type) VALUES (?,?, 'Issue')";
            db.query(issueSql, [userId, bookId], (err3) => {
                if (err3) return res.status(500).json({ error: err3 });

                // Reduce stock
                db.query("UPDATE books SET quantity=quantity-1 WHERE id=?", [bookId], (err4) => {
                    if (err4) return res.status(500).json({ error: err4 });
                    res.json({ message: "Book issued successfully!" });
                });
            });
        });
    });
};

// Return a book
exports.returnBook = (req, res) => {
    const { userId, bookId } = req.body;

    const findSql = "SELECT * FROM transactions WHERE user_id=? AND book_id=? AND type='Issue' ORDER BY transaction_date DESC LIMIT 1";
    db.query(findSql, [userId, bookId], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (!result.length) return res.status(400).json({ error: "No such issued book found" });

        const issueDate = new Date(result[0].transaction_date);
        const returnDate = new Date();
        const diffDays = Math.ceil((returnDate - issueDate) / (1000 * 60 * 60 * 24));
        const fine = diffDays > 0 ? diffDays * FINE_PER_DAY : 0;

        const returnSql = "INSERT INTO transactions (user_id, book_id, type) VALUES (?,?, 'Return')";
        db.query(returnSql, [userId, bookId], (err2) => {
            if (err2) return res.status(500).json({ error: err2 });

            db.query("UPDATE books SET quantity=quantity+1 WHERE id=?", [bookId], (err3) => {
                if (err3) return res.status(500).json({ error: err3 });
                res.json({ message: "Book returned successfully!", fine, daysLate: diffDays });
            });
        });
    });
};

// Get transactions for a user
exports.getUserTransactions = (req, res) => {
    const { userId } = req.params;
    const sql = `
    SELECT t.id, b.title, b.author, b.genre, t.type, t.transaction_date
    FROM transactions t
    JOIN books b ON t.book_id = b.id
    WHERE t.user_id=?
    ORDER BY t.transaction_date DESC`;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};
