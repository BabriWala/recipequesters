const express = require("express");
const { statistics } = require("../controllers/statisticsController");

const router = express.Router();

router.get("/statistics", statistics);

module.exports = router;
