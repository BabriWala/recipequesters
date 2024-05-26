// src/routes/userRoutes.ts
import { Router } from "express";
import {
  registerUser,
  getAllUsers,
  buyCoins,
  refreshToken,
} from "../controllers/userControllers";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/refresh-token", refreshToken);
router.post("/buy-coins", authMiddleware, buyCoins);
router.get("/users", getAllUsers);

export default router;
