"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
// @ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token) => {
    console.log(jsonwebtoken_1.default);
    console.log(token, process.env.TOKEN);
    if (!token) {
        return null;
    }
    return jsonwebtoken_1.default.verify(token, process.env.TOKEN);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwtUtils.js.map