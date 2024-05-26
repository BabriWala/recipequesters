import { Schema, model, Document } from "mongoose";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User"; // Import User model if not already imported

export interface IReaction {
  type: string;
  count: number;
}

interface IPurchase {
  email: string;
  time: Date;
}

export interface IRecipe extends Document {
  creatorEmail: string;
  recipeName: string;
  imageUrl: string;
  details: string;
  reactions: IReaction[];
  purchases: IPurchase[];
  country: string;
  youtubeLink: string;
  category: string;
  watchedTimes: number;
  viewedBy: { userId: string; userEmail: string; userDisplayName: string }[]; // Updated viewedBy field
}

const reactionSchema = new Schema<IReaction>({
  type: { type: String },
  count: { type: Number, default: 0 },
});

const purchaseSchema = new Schema<IPurchase>({
  email: { type: String },
  time: { type: Date, default: Date.now },
});

const recipeSchema = new Schema<IRecipe>(
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

const Recipe = model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
