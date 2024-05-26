"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.getAllUsers = exports.buyCoins = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    const payload = {
        user: {
            id: user.id,
        },
    };
    const jwtSecret = process.env.TOKEN_SECRET || "some_token";
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: "1h" });
};
const generateRefreshToken = (user) => {
    const payload = {
        user: {
            id: user.id,
        },
    };
    const jwtSecret = process.env.REFRESH_TOKEN_SECRET || "some_refresh_token";
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: "7d" });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { displayName, photoUrl, email } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            user.refreshToken = refreshToken;
            yield user.save();
            return res.json({ user, accessToken, refreshToken });
        }
        user = new User_1.default({
            displayName,
            photoUrl,
            email,
            coins: 50,
            dollar: 100,
        });
        yield user.save();
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        yield user.save();
        res.json({ user, accessToken, refreshToken });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.registerUser = registerUser;
const buyCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount } = req.body;
    try {
        // Extract token from headers
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ msg: "Authorization denied" });
        }
        // Verify token and extract user ID
        // @ts-ignore
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.user.userId;
        // Fetch the user from the database using the decoded user ID
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Calculate coins to be added based on the amount
        let coinsToAdd = 0;
        if (amount === 1) {
            coinsToAdd = 100;
        }
        else if (amount === 5) {
            coinsToAdd = 500;
        }
        else if (amount === 10) {
            coinsToAdd = 1000;
        }
        else {
            return res.status(400).json({ msg: "Invalid amount" });
        }
        // Update the user's coins and deduct dollars
        user.coins += coinsToAdd;
        user.dollar -= amount;
        // Save the updated user
        yield user.save();
        // Return the updated user
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token" });
        }
        res.status(500).send("Server Error");
    }
});
exports.buyCoins = buyCoins;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all users from the database
        const users = yield User_1.default.find();
        return users;
    }
    catch (err) {
        console.error(err.message);
        throw err;
    }
});
exports.getAllUsers = getAllUsers;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ msg: "No refresh token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "some_refresh_token");
        const userId = decoded.user.id;
        const user = yield User_1.default.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ msg: "Invalid refresh token" });
        }
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.error(err.message);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid refresh token" });
        }
        res.status(500).send("Server Error");
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=userControllers.js.map