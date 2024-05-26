import { Request, Response } from "express";
import User, { IUser } from "../models/User";
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
      dollar: 100,
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

export const buyCoins = async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    // Extract token from headers
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    // Verify token and extract user ID
    // @ts-ignore
    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded.user.userId;

    // Fetch the user from the database using the decoded user ID
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Calculate coins to be added based on the amount
    let coinsToAdd = 0;
    if (amount === 1) {
      coinsToAdd = 100;
    } else if (amount === 5) {
      coinsToAdd = 500;
    } else if (amount === 10) {
      coinsToAdd = 1000;
    } else {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    // Update the user's coins and deduct dollars
    user.coins += coinsToAdd;
    user.dollar -= amount;

    // Save the updated user
    await user.save();

    // Return the updated user
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    res.status(500).send("Server Error");
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    // Fetch all users from the database
    const users: IUser[] = await User.find();
    return users;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
