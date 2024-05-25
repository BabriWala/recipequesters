// src/routes/imageUploadRoutes.ts
import { Router } from "express";
import { uploadImage } from "../controllers/imageUploadController";

const router = Router();

router.post("/upload", uploadImage);

export default router;
