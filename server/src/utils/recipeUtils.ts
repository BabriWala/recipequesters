// @ts-nocheck
import axios from "axios";
import Recipe from "../models/Reciepe";

// @ts-nocheck
export const updateRecipeViews = async (
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

export const updateCoins = async (userId, userEmail, creatorEmail) => {
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

export const updatePurchaseData = async (recipe, userEmail) => {
  const purchaseData = {
    email: userEmail,
    time: new Date(),
  };
  recipe.purchases.push(purchaseData);
  await recipe.save();
};

export const createNewRecipe = async (
  creatorEmail,
  imageUrl,
  details,
  country,
  youtubeLink,
  recipeName,
  category
) => {
  console.log(
    creatorEmail,
    imageUrl,
    details,
    country,
    youtubeLink,
    recipeName,
    category
  );
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
