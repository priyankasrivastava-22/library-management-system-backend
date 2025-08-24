const db = require("../config/db");

// Get all books
exports.getBooks = (req, res) => {
    const sql = "SELECT * FROM books";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};
