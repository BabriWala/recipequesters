"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    displayName: { type: String, required: true },
    photoUrl: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    coins: { type: Number, default: 50 },
    dollar: { type: Number, default: 100 },
    refreshToken: { type: String },
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
