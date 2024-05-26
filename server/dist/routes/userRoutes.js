"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/register", userControllers_1.registerUser);
router.post("/refresh-token", userControllers_1.refreshToken);
router.post("/buy-coins", auth_1.authMiddleware, userControllers_1.buyCoins);
router.get("/users", userControllers_1.getAllUsers);
exports.default = router;
