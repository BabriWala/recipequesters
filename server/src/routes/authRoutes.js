const express = require("express");
const { refreshToken } = require("../controllers/userControllers");

const router = express.Router();

router.post("/", refreshToken);

module.exports = router;
