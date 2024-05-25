// src/routes/userRoutes.ts
import { Router } from "express";
import { registerUser } from "../controllers/userControllers";

const router = Router();

router.post("/register", registerUser);

export default router;
