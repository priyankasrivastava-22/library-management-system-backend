// backend/routes/transactions.js

const router = require("express").Router();
const transactionController = require("../controllers/transactionController");

// issuing a book
router.post("/issue", transactionController.issueBook);

// returning a book
router.post("/return", transactionController.returnBook);

// getting all transactions (for admin dashboard)
router.get("/", transactionController.getAllTransactions);

// getting transactions of a specific user (student "My Books")
router.get("/user/:userId", transactionController.getUserTransactions);

// adding review to a transaction
router.post("/review/:id", transactionController.addReview);

module.exports = router;