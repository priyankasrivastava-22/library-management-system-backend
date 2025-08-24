const express = require("express");
const router = express.Router();
const { submitFeedback, getAllFeedback } = require("../controllers/feedbackController");

// Submit feedback
router.post("/submit", submitFeedback);

// Get all feedback
router.get("/", getAllFeedback);

module.exports = router;
