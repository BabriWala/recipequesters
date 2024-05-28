const express = require("express");
const { statistics } = require("../controllers/statisticsController");

const router = express.Router();

router.get("/", statistics);

module.exports = router;
