// src/controllers/recipeController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import Recipe, { IRecipe, IReaction } from "../models/Reciepe";
import axios from "axios";
import { verifyToken } from "../utils/jwtUtils";
import { getUserDetails } from "../utils/userUtils";
import {
  createNewRecipe,
  updateCoins,
  updatePurchaseData,
  updateRecipeViews,
  uploadImageToImgBB,
} from "../utils/recipeUtils";
import { addReaction, removeReaction } from "../utils/reactionUtils";

export const createRecipe = async (req: Request, res: Response) => {
  const { imageUrl, details, country, youtubeLink, category, recipeName } =
    req.body;
  try {
    // Verify the token to get the user id
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token);
    // @ts-ignore
    const userId = decoded?.user?.id;

    // Fetch user details to get the creator's email

    const user = await getUserDetails(userId);

    // Upload image to ImgBB
    const imgBBResponse = await uploadImageToImgBB(imageUrl);
    const imgBBUrl = imgBBResponse.data.data.url;

    // Create the recipe with the creator's email and ImgBB URL
    const recipe = await createNewRecipe(
      user.email,
      imgBBUrl,
      details,
      country,
      youtubeLink,
      recipeName,
      category
    );

    // Update user's profile to add one coin
    await User.findByIdAndUpdate(userId, { $inc: { coins: 1 } });

    res.status(201).json(recipe);
  } catch (err: any) {
    console.error(err.message);
    if (err.response) {
      console.error("Error response from ImgBB:", err.response.data);
    }
    res.status(500).send("Server error");
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  const { category, country, recipeName, page = 1, limit = 10 } = req.query;
  console.log(req.query);

  try {
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (country) {
      query.country = country;
    }

    if (recipeName) {
      query.recipeName = { $regex: recipeName, $options: "i" }; // Case-insensitive search by title
    }

    const recipes = await Recipe.find(query)
      .select("recipeName category imageUrl creatorEmail country _id")
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json(recipes);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    const tokenData = verifyToken(req);
    if (tokenData) {
      // @ts-ignore
      const { id: userId } = tokenData?.user;
      const { email: userEmail, displayName: userDisplayName } =
        await getUserDetails(userId);

      await updateRecipeViews(recipe, userId, userEmail, userDisplayName);
      await updateCoins(userId, userEmail, recipe.creatorEmail);
      await updatePurchaseData(recipe, userEmail);
    }

    res.json(recipe);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateRecipeReactions = async (req: Request, res: Response) => {
  const { reactionType, action } = req.body;

  try {
    // Verify token
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }
    const decoded = verifyToken(token);
    // @ts-ignore
    const userId = decoded.user.userId;

    // Fetch user details
    const user = await getUserDetails(userId);

    // Fetch recipe and handle reactions
    const recipeId = req.params.id;
    let recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Add or remove reaction based on action
    if (action === "add") {
      addReaction(recipe, user, reactionType);
    } else if (action === "remove") {
      removeReaction(recipe, userId, reactionType);
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }

    // Save the updated recipe
    await recipe.save();
    res.json(recipe);
  } catch (err: any) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    res.status(500).send("Server error");
  }
};

export const findSimilarRecipesByCategory = async (
  req: Request,
  res: Response
) => {
  const recipeId = req.params.id;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    const similarRecipes = await Recipe.find({
      category: recipe.category,
      _id: { $ne: recipeId },
    })
      .limit(5) // Limit to 5 similar recipes
      .select("recipeName category imageUrl creatorEmail country _id");

    res.json(similarRecipes);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
