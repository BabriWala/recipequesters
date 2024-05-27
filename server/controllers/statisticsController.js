const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Recipe = require("../models/Reciepe");

const statistics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const usersWithPhotosCount = await User.countDocuments({
      photoUrl: { $exists: true },
    });

    const totalCoins = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$coins" } } },
    ]);

    const totalDollars = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$dollar" } } },
    ]);

    const recipeCount = await Recipe.countDocuments();
    const recipesByCategory = await Recipe.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const mostWatchedRecipe = await Recipe.findOne().sort({
      watchedTimes: -1,
    });
    const mostViewedByUsers = await Recipe.aggregate([
      { $unwind: "$viewedBy" },
      { $group: { _id: "$viewedBy.userDisplayName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const totalWatchedTimes = await Recipe.aggregate([
      { $group: { _id: null, total: { $sum: "$watchedTimes" } } },
    ]);
    const mostReactedRecipe = await Recipe.findOne().sort({
      "reactions.count": -1,
    });

    const totalReactions = await Recipe.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$reactions" } } } },
    ]);

    const averageReactionsPerRecipe =
      totalReactions?.length > 0 ? totalReactions[0].total / recipeCount : 0;

    res.json({
      userStatistics: {
        userCount,
        usersWithPhotosCount,
        totalCoins: totalCoins.length > 0 ? totalCoins[0].total : 0,
        totalDollars: totalDollars.length > 0 ? totalDollars[0].total : 0,
      },
      recipeStatistics: {
        recipeCount,
        recipesByCategory,
        mostWatchedRecipe,
        mostViewedByUsers:
          mostViewedByUsers.length > 0 ? mostViewedByUsers[0] : null,
        totalWatchedTimes:
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

module.exports = {
  statistics,
};
