"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/register", userControllers_1.registerUser);
router.post("/buy-coins", auth_1.authMiddleware, userControllers_1.buyCoins);
router.get("/", userControllers_1.getAllUsers);
router.get("/me", userControllers_1.getUserDetails);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map