const express = require("express");
const router = express.Router();
const {
  registerUser,
  // getAllUsers,
  buyCoins,
  refreshToken,
  getUserDetails,
} = require("../controllers/userControllers");
const { authMiddleware } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/buy-coins", authMiddleware, buyCoins);
// router.get("/", getAllUsers);
router.get("/me", getUserDetails);

module.exports = router;
