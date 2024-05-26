"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewRecipe = exports.uploadImageToImgBB = exports.updatePurchaseData = exports.updateCoins = exports.updateRecipeViews = void 0;
// @ts-nocheck
const updateRecipeViews = (recipe, userId, userEmail, userDisplayName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!recipe.viewedBy.includes(userId)) {
        recipe.viewedBy.push({ userId, userEmail, userDisplayName });
        recipe.watchedTimes++;
        yield recipe.save();
    }
});
exports.updateRecipeViews = updateRecipeViews;
const updateCoins = (userId, userEmail, creatorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // Decrease user's coins by 10
    yield User.findByIdAndUpdate(userId, { $inc: { coins: -10 } });
    // Increment creator's coins only if the user is not the creator
    if (creatorEmail !== userEmail) {
        yield User.findOneAndUpdate({ email: creatorEmail }, { $inc: { coins: 1 } });
    }
});
exports.updateCoins = updateCoins;
const updatePurchaseData = (recipe, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseData = {
        email: userEmail,
        time: new Date(),
    };
    recipe.purchases.push(purchaseData);
    yield recipe.save();
});
exports.updatePurchaseData = updatePurchaseData;
const uploadImageToImgBB = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const imgBBApiKey = process.env.IMGBBAPIKEY || "your_imgbb_api_key";
    return axios.post(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, {
        image: imageUrl,
    });
});
exports.uploadImageToImgBB = uploadImageToImgBB;
const createNewRecipe = (creatorEmail, imageUrl, details, country, youtubeLink, recipeName, category) => __awaiter(void 0, void 0, void 0, function* () {
    const recipe = new Recipe({
        creatorEmail,
        imageUrl,
        details,
        country,
        youtubeLink,
        recipeName,
        category,
    });
    yield recipe.save();
    return recipe;
});
exports.createNewRecipe = createNewRecipe;
//# sourceMappingURL=recipeUtils.js.map