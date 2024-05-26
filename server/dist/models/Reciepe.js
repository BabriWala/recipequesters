"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reactionSchema = new mongoose_1.Schema({
    type: { type: String },
    count: { type: Number, default: 0 },
});
const purchaseSchema = new mongoose_1.Schema({
    email: { type: String },
    time: { type: Date, default: Date.now },
});
const recipeSchema = new mongoose_1.Schema({
    creatorEmail: { type: String, required: true },
    recipeName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    details: { type: String, required: true },
    reactions: { type: [reactionSchema], default: [] },
    purchases: { type: [purchaseSchema], default: [] },
    country: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["Beef", "Chicken", "Vegetables", "Rice"],
    },
    watchedTimes: { type: Number, default: 0 },
    viewedBy: [{ userId: String, userEmail: String, userDisplayName: String }], // Updated viewedBy field
}, { timestamps: true });
const Recipe = (0, mongoose_1.model)("Recipe", recipeSchema);
exports.default = Recipe;
