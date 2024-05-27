"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// src/middleware/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["Authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "your_jwt_secret");
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
exports.default = auth;
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["Authorization"]) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ msg: "Authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        // @ts-ignore
        req === null || req === void 0 ? void 0 : req.user = decoded.user;
        next();
    }
    catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map