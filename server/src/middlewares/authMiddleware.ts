import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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
    req.user = decoded.user;
    next();
  } catch (err) {
    // @ts-ignore

    console.error(err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default verifyToken;
