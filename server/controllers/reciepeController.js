const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Recipe = require("../models/Reciepe");
const axios = require("axios");
const { verifyToken } = require("../utils/jwtUtils");
const { getUserDetails } = require("../utils/userUtils");
const {
  createNewRecipe,
  updateCoins,
  updatePurchaseData,
  updateRecipeViews,
  uploadImageToImgBB,
} = require("../utils/recipeUtils");
const { addReaction, removeReaction } = require("../utils/reactionUtils");

const createRecipe = async (req, res) => {
  const { details, imageUrl, country, youtubeLink, category, recipeName } =
    req.body;

  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("No token provided");
    }

    const decoded = verifyToken(token);
    const userId = decoded?.user?.id;
    if (!userId) {
      return res.status(401).send("Invalid token");
    }

    const user = await getUserDetails(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const creatorEmail = user.email;

    const recipe = new Recipe({
      creatorEmail,
      imageUrl,
      details,
      country,
      youtubeLink,
      recipeName,
      category,
    });
    await recipe.save();
    await User.findByIdAndUpdate(userId, { $inc: { coins: 1 } });

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.response) {
      console.error("Error response from ImgBB:", err.response.data);
    }
    res.status(500).send("Server error");
  }
};

const getRecipes = async (req, res) => {
  const { category, country, recipeName, page = 1, limit = 10 } = req.query;

  try {
    let query = {};

    if (category) {
      query.category = category;
    }

    if (country) {
      query.country = country;
    }

    if (recipeName) {
      query.recipeName = { $regex: recipeName, $options: "i" };
    }

    const recipes = await Recipe.find(query)
      .select("recipeName category imageUrl creatorEmail country _id")
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    const tokenData = verifyToken(req);
    if (tokenData) {
      const { id: userId } = tokenData?.user;
      const { email: userEmail, displayName: userDisplayName } =
        await getUserDetails(userId);

      await updateRecipeViews(recipe, userId, userEmail, userDisplayName);
      await updateCoins(userId, userEmail, recipe.creatorEmail);
      await updatePurchaseData(recipe, userEmail);
    }

    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const updateRecipeReactions = async (req, res) => {
  const { reactionType, action } = req.body;

  try {
    const token = req.headers["Authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }
    const decoded = verifyToken(token);
    const userId = decoded.user.userId;

    const user = await getUserDetails(userId);

    const recipeId = req.params.id;
    let recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    if (action === "add") {
      addReaction(recipe, user, reactionType);
    } else if (action === "remove") {
      removeReaction(recipe, userId, reactionType);
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    res.status(500).send("Server error");
  }
};

const findSimilarRecipesByCategory = async (req, res) => {
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
      .limit(5)
      .select("recipeName category imageUrl creatorEmail country _id");

    res.json(similarRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipeReactions,
  findSimilarRecipesByCategory,
};
