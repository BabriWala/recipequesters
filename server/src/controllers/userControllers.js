const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateAccessToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const jwtSecret = process.env.TOKEN;
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
};

const generateRefreshToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const jwtSecret = process.env.TOKEN;
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { displayName, photoURL, email } = req.body;

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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ user, accessToken: newAccessToken });
  } catch (err) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    res.status(500).send("Server Error");
  }
};

const buyCoins = async (req, res) => {
  const { amount } = req.body;

  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

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

    user.coins += coinsToAdd;
    user.dollar -= amount;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    res.status(500).send("Server Error");
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.TOKEN);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }
    res.status(500).send("Server Error");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  registerUser,
  getUserDetails,
  buyCoins,
  refreshToken,
};
