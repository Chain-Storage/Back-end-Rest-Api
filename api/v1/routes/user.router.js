const express = require("express");
const { login, signUp, logout } = require("../controllers/auth.controller");
const {
  sendFile,
  buyGbGold,
  buyGbPreminum,
} = require("../controllers/storage.controllers");
const { sendTransaction } = require("../controllers/transaction.controller");
const { getMe, getUser } = require("../controllers/user.controller");
const { protect } = require("../middlewares/isLogin");
const { walletBalance } = require("../middlewares/walletBalance");

const router = express.Router();

// Auth System
router.post("/signup", signUp);
router.post("/login", login);

//  User Profile
router.use(protect);
router.use(walletBalance);
router.get("/me", getMe, getUser);
router.get("/me/logout", logout);

// Wallet
router.post("/me/sendTransactions", sendTransaction);

// File Storage
router.post("/me/storage/uploadFile", sendFile);
router.patch("/me/storage/buyGbGold", buyGbGold);
router.patch("/me/storage/buyGbPreminum", buyGbPreminum);

module.exports = router;
