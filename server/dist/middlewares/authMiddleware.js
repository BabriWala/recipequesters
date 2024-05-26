"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ msg: "Authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "some_token");
        // @ts-ignore
        req.user = decoded.user;
        next();
    }
    catch (err) {
        // @ts-ignore
        console.error(err.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
};
exports.default = verifyToken;
