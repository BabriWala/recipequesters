// src/routes/userRoutes.ts
import { Router } from "express";
import {
  registerUser,
  getAllUsers,
  buyCoins,
} from "../controllers/userControllers";

const router = Router();

router.post("/register", registerUser);
router.post("/buy-coins", buyCoins);
router.get("/users", getAllUsers);

export default router;
