// src/middleware/auth.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.TOKEN_SECRET || "some_token"
    );
    // @ts-ignore
    req?.user = decoded.user;
    next();
  } catch (err: any) {
    console.error(err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};
