// src/routes/userRoutes.ts
import { Router } from "express";
import { refreshToken } from "../controllers/userControllers";

const router = Router();

router.post("/", refreshToken);

export default router;
