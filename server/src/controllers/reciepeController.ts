// src/controllers/recipeController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Recipe, { IRecipe, IReaction } from "../models/Reciepe";

export const createRecipe = async (req: Request, res: Response) => {
  const { imageUrl, details, country, youtubeLink, category, recipeName } =
    req.body;

  // Check if the request contains a valid token
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    // Verify the token to get the user id
    // @ts-ignore
    const decoded: any = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.user.id;

    // Fetch user details to get the creator's email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create the recipe with the creator's email
    const recipe = new Recipe({
      creatorEmail: user.email,
      imageUrl,
      details,
      country,
      youtubeLink,
      recipeName,
      category,
    });

    await recipe.save();

    // Update user's profile to add one coin
    await User.findByIdAndUpdate(userId, { $inc: { coins: 1 } });

    res.status(201).json(recipe);
  } catch (err: any) {
    console.error(err.message);
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

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      // @ts-ignore
      const decoded: any = jwt.verify(token, process.env.TOKEN);
      const userId = decoded.user.id;

      // Fetch user details including email from the User model using the user ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const userEmail = user.email;
      const userDisplayName = user.displayName; // Assuming you have displayName in your User model

      if (!recipe.viewedBy.includes(userId)) {
        // @ts-ignore
        recipe.viewedBy.push({ userId, userEmail, userDisplayName });
        recipe.watchedTimes++;
        await recipe.save();

        // Decrease user's coins by 10
        await User.findByIdAndUpdate(userId, { $inc: { coins: -10 } });

        // Increment creator's coins only if the user is not the creator
        if (recipe.creatorEmail !== userEmail) {
          await User.findOneAndUpdate(
            { email: recipe.creatorEmail },
            { $inc: { coins: 1 } }
          );
        }

        const purchaseData = {
          email: userEmail,
          time: new Date(),
        };
        recipe.purchases.push(purchaseData);
        await recipe.save();
      }
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
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    // @ts-ignore
    const decoded: any = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const recipeId = req.params.id;
    let recipe: IRecipe | null = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    let reaction: IReaction | undefined = recipe.reactions.find(
      (r) => r.type === reactionType
    );

    if (action === "add") {
      if (reaction) {
        // @ts-ignore

        if (reaction.users?.some((user) => user.userId === userId)) {
          return res.json(recipe);
        } else {
          reaction.count++;
          // @ts-ignore
          reaction.users?.push({
            userId: user._id,
            userDisplayName: user.displayName,
          });
        }
      } else {
        recipe.reactions.push({
          type: reactionType,
          count: 1,
          // @ts-ignore
          users: [{ userId: user._id, userDisplayName: user.displayName }],
        });
      }
    } else if (action === "remove") {
      if (reaction) {
        reaction.count--;
        // @ts-ignore

        const userIndex = reaction.users?.findIndex(
          // @ts-ignore

          (user) => user.userId === userId
        );
        if (userIndex !== -1) {
          // @ts-ignore

          reaction.users?.splice(userIndex, 1);
        }
        if (reaction.count === 0) {
          recipe.reactions = recipe.reactions.filter((r) => r !== reaction);
        }
      }
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }

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
