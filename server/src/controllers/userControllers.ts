import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { displayName, photoUrl, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const jwtSecret = process.env.TOKEN || "some_token"; // Fallback if TOKEN is undefined
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

      return res.json({ user, token });
    }

    user = new User({
      displayName,
      photoUrl,
      email,
      coins: 50,
    });

    await user.save();

    const jwtSecret = process.env.TOKEN || "some_token"; // Fallback if TOKEN is undefined
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.json({ user, token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
