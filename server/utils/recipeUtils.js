const Recipe = require("../models/Reciepe");
const User = require("../models/User");

const updateRecipeViews = async (
  recipe,
  userId,
  userEmail,
  userDisplayName
) => {
  if (!recipe.viewedBy.includes(userId)) {
    recipe.viewedBy.push({ userId, userEmail, userDisplayName });
    recipe.watchedTimes++;
    await recipe.save();
  }
};

const updateCoins = async (userId, userEmail, creatorEmail) => {
  // Decrease user's coins by 10
  await User.findByIdAndUpdate(userId, { $inc: { coins: -10 } });

  // Increment creator's coins only if the user is not the creator
  if (creatorEmail !== userEmail) {
    await User.findOneAndUpdate(
      { email: creatorEmail },
      { $inc: { coins: 1 } }
    );
  }
};

const updatePurchaseData = async (recipe, userEmail) => {
  const purchaseData = {
    email: userEmail,
    time: new Date(),
  };
  recipe.purchases.push(purchaseData);
  await recipe.save();
};

const createNewRecipe = async (
  creatorEmail,
  imageUrl,
  details,
  country,
  youtubeLink,
  recipeName,
  category
) => {
  
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
  return recipe;
};

module.exports = {
  updateRecipeViews,
  updateCoins,
  updatePurchaseData,
  createNewRecipe,
};
