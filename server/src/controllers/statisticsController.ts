// src/controllers/recipeController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Recipe, { IRecipe, IReaction } from "../models/Reciepe";

export const statistics = async (req: Request, res: Response) => {
  try {
    const userCount: number = await User.countDocuments();
    const usersWithPhotosCount: number = await User.countDocuments({
      photoUrl: { $exists: true },
    });
    // @ts-ignore
    const totalCoins: number = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$coins" } } },
    ]);
    // @ts-ignore
    const totalDollars: number = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$dollar" } } },
    ]);

    const recipeCount: number = await Recipe.countDocuments();
    const recipesByCategory: any = await Recipe.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const mostWatchedRecipe: IRecipe | null = await Recipe.findOne().sort({
      watchedTimes: -1,
    });
    const mostViewedByUsers: any = await Recipe.aggregate([
      { $unwind: "$viewedBy" },
      { $group: { _id: "$viewedBy.userDisplayName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    // @ts-ignore
    const totalWatchedTimes: number = await Recipe.aggregate([
      { $group: { _id: null, total: { $sum: "$watchedTimes" } } },
    ]);
    const mostReactedRecipe: IRecipe | null = await Recipe.findOne().sort({
      "reactions.count": -1,
    });
    // @ts-ignore
    const totalReactions: number = await Recipe.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$reactions" } } } },
    ]);
    // @ts-ignore
    const averageReactionsPerRecipe: number =
      // @ts-ignore
      totalReactions?.length > 0 ? totalReactions[0].total / recipeCount : 0;

    res.json({
      userStatistics: {
        userCount,
        usersWithPhotosCount,
        // @ts-ignore

        totalCoins: totalCoins.length > 0 ? totalCoins[0].total : 0,
        // @ts-ignore

        totalDollars: totalDollars.length > 0 ? totalDollars[0].total : 0,
      },
      recipeStatistics: {
        recipeCount,
        recipesByCategory,
        mostWatchedRecipe,
        mostViewedByUsers:
          mostViewedByUsers.length > 0 ? mostViewedByUsers[0] : null,
        totalWatchedTimes:
          // @ts-ignore

          totalWatchedTimes?.length > 0 ? totalWatchedTimes[0].total : 0,
        mostReactedRecipe,
        averageReactionsPerRecipe,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
