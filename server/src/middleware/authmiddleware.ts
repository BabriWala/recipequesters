// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseAdmin";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
