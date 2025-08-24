const express = require("express");
const router = express.Router();
const { issueBook, returnBook, getUserTransactions } = require("../controllers/transactionController");

router.post("/issue", issueBook);
router.post("/return", returnBook);
router.get("/:userId", getUserTransactions);

module.exports = router;
