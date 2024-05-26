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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSimilarRecipesByCategory = exports.updateRecipeReactions = exports.getRecipeById = exports.getRecipes = exports.createRecipe = void 0;
const User_1 = __importDefault(require("../models/User"));
const Reciepe_1 = __importDefault(require("../models/Reciepe"));
const jwtUtils_1 = require("../utils/jwtUtils");
const userUtils_1 = require("../utils/userUtils");
const recipeUtils_1 = require("../utils/recipeUtils");
const reactionUtils_1 = require("../utils/reactionUtils");
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { imageUrl, details, country, youtubeLink, category, recipeName } = req.body;
    try {
        // Verify the token to get the user id
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        // @ts-ignore
        const userId = (_b = decoded === null || decoded === void 0 ? void 0 : decoded.user) === null || _b === void 0 ? void 0 : _b.id;
        // Fetch user details to get the creator's email
        const user = yield (0, userUtils_1.getUserDetails)(userId);
        // Upload image to ImgBB
        const imgBBResponse = yield (0, recipeUtils_1.uploadImageToImgBB)(imageUrl);
        const imgBBUrl = imgBBResponse.data.data.url;
        // Create the recipe with the creator's email and ImgBB URL
        const recipe = yield (0, recipeUtils_1.createNewRecipe)(user.email, imgBBUrl, details, country, youtubeLink, recipeName, category);
        // Update user's profile to add one coin
        yield User_1.default.findByIdAndUpdate(userId, { $inc: { coins: 1 } });
        res.status(201).json(recipe);
    }
    catch (err) {
        console.error(err.message);
        if (err.response) {
            console.error("Error response from ImgBB:", err.response.data);
        }
        res.status(500).send("Server error");
    }
});
exports.createRecipe = createRecipe;
const getRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, country, recipeName, page = 1, limit = 10 } = req.query;
    console.log(req.query);
    try {
        let query = {};
        if (category) {
            query.category = category;
        }
        if (country) {
            query.country = country;
        }
        if (recipeName) {
            query.recipeName = { $regex: recipeName, $options: "i" }; // Case-insensitive search by title
        }
        const recipes = yield Reciepe_1.default.find(query)
            .select("recipeName category imageUrl creatorEmail country _id")
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
            .skip((+page - 1) * +limit)
            .limit(+limit);
        res.json(recipes);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.getRecipes = getRecipes;
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = req.params.id;
        const recipe = yield Reciepe_1.default.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ msg: "Recipe not found" });
        }
        const tokenData = (0, jwtUtils_1.verifyToken)(req);
        if (tokenData) {
            // @ts-ignore
            const { id: userId } = tokenData === null || tokenData === void 0 ? void 0 : tokenData.user;
            const { email: userEmail, displayName: userDisplayName } = yield (0, userUtils_1.getUserDetails)(userId);
            yield (0, recipeUtils_1.updateRecipeViews)(recipe, userId, userEmail, userDisplayName);
            yield (0, recipeUtils_1.updateCoins)(userId, userEmail, recipe.creatorEmail);
            yield (0, recipeUtils_1.updatePurchaseData)(recipe, userEmail);
        }
        res.json(recipe);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.getRecipeById = getRecipeById;
const updateRecipeReactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { reactionType, action } = req.body;
    try {
        // Verify token
        const token = (_c = req.header("Authorization")) === null || _c === void 0 ? void 0 : _c.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ msg: "Authorization denied" });
        }
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        // @ts-ignore
        const userId = decoded.user.userId;
        // Fetch user details
        const user = yield (0, userUtils_1.getUserDetails)(userId);
        // Fetch recipe and handle reactions
        const recipeId = req.params.id;
        let recipe = yield Reciepe_1.default.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ msg: "Recipe not found" });
        }
        // Add or remove reaction based on action
        if (action === "add") {
            (0, reactionUtils_1.addReaction)(recipe, user, reactionType);
        }
        else if (action === "remove") {
            (0, reactionUtils_1.removeReaction)(recipe, userId, reactionType);
        }
        else {
            return res.status(400).json({ msg: "Invalid action" });
        }
        // Save the updated recipe
        yield recipe.save();
        res.json(recipe);
    }
    catch (err) {
        console.error(err.message);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token" });
        }
        res.status(500).send("Server error");
    }
});
exports.updateRecipeReactions = updateRecipeReactions;
const findSimilarRecipesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeId = req.params.id;
    try {
        const recipe = yield Reciepe_1.default.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ msg: "Recipe not found" });
        }
        const similarRecipes = yield Reciepe_1.default.find({
            category: recipe.category,
            _id: { $ne: recipeId },
        })
            .limit(5) // Limit to 5 similar recipes
            .select("recipeName category imageUrl creatorEmail country _id");
        res.json(similarRecipes);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.findSimilarRecipesByCategory = findSimilarRecipesByCategory;
//# sourceMappingURL=reciepeController.js.map