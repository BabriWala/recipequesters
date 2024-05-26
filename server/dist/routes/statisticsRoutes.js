"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const statisticsController_1 = require("../controllers/statisticsController");
const router = (0, express_1.Router)();
router.get("/statistics", statisticsController_1.statistics);
exports.default = router;
//# sourceMappingURL=statisticsRoutes.js.map