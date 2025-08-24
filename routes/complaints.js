const express = require("express");
const router = express.Router();
const { raiseComplaint, getUserComplaints, respondComplaint, reopenComplaint } = require("../controllers/complaintController");

// Raise complaint
router.post("/raise", raiseComplaint);

// Get all complaints of user
router.get("/:userId", getUserComplaints);

// Admin responds (for simplicity here, just API)
router.post("/respond/:id", respondComplaint);

// Reopen complaint
router.post("/reopen/:id", reopenComplaint);

module.exports = router;
