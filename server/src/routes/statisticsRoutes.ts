// src/routes/userRoutes.ts
import { Router } from "express";
import { statistics } from "../controllers/statisticsController";

const router = Router();

router.get("/statistics", statistics);

export default router;
