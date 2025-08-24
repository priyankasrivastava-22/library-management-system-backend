const db = require("../config/db");

// Submit feedback
exports.submitFeedback = (req, res) => {
    const { userId, feedback } = req.body;
    const sql = "INSERT INTO feedback (user_id, feedback_text) VALUES (?,?)";
    db.query(sql, [userId, feedback], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Feedback submitted successfully!" });
    });
};

// Get all feedback
exports.getAllFeedback = (req, res) => {
    const sql = "SELECT * FROM feedback";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};
