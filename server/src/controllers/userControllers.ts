// @ts-nocheck
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

const generateAccessToken = (user: IUser) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const jwtSecret = process.env.TOKEN;
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
};

const generateRefreshToken = (user: IUser) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const jwtSecret = process.env.TOKEN;
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
};
export const registerUser = async (req: Request, res: Response) => {
  const { displayName, photoURL, email } = req.body;
  console.log("i am here");

  try {
    let user = await User.findOne({ email });

    if (user) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      return res.json({ user, accessToken, refreshToken });
    }

    user = new User({
      displayName,
      photoURL,
      email,
      coins: 50,
      dollar: 100,
    });

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ user, accessToken, refreshToken });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    // Verify token and extract user ID
    const decoded: any = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.user.id;

    // Fetch the user from the database using the decoded user ID
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user);

    // Return the user details along with the new access token
    res.json({ user, accessToken: newAccessToken });
  } catch (err: any) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    res.status(500).send("Server Error");
  }
};

export const buyCoins = async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    // Extract token from headers
    const token = req.headers["Authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    // Verify token and extract user ID
    // @ts-ignore
    const decoded: any = jwt.verify(token, process.env.TOKEN);
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

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "No refresh token provided" });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, process.env.TOKEN);
    const userId = decoded.user.id;

    const user: IUser | null = await User.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }
    res.status(500).send("Server Error");
  }
};
