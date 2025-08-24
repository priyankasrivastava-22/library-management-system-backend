const db = require("../config/db");

// Raise a complaint
exports.raiseComplaint = (req, res) => {
    const { userId, issue } = req.body;
    const sql = "INSERT INTO complaints (user_id, issue, status) VALUES (?,?, 'Open')";
    db.query(sql, [userId, issue], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Complaint raised successfully!" });
    });
};

// Get all complaints of user
exports.getUserComplaints = (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM complaints WHERE user_id=?";
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Respond to complaint
exports.respondComplaint = (req, res) => {
    const { id } = req.params;
    const { response } = req.body;
    const sql = "UPDATE complaints SET response=?, status='Closed' WHERE id=?";
    db.query(sql, [response, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Complaint responded successfully!" });
    });
};

// Reopen complaint
exports.reopenComplaint = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE complaints SET status='Reopened' WHERE id=?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Complaint reopened successfully!" });
    });
};
