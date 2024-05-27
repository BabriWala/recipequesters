"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
router.post("/", userControllers_1.refreshToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map