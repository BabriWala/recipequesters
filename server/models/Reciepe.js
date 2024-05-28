const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./User"); // Import User model if not already imported

const { Schema, model } = mongoose;

const reactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // User ID
  reactionType: { type: String }, // Reaction type
});

const purchaseSchema = new Schema({
  email: { type: String },
  time: { type: Date, default: Date.now },
});

const recipeSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
