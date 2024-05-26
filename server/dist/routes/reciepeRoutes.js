"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/recipeRoutes.ts
const express_1 = require("express");
const reciepeController_1 = require("../controllers/reciepeController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/", reciepeController_1.createRecipe);
router.get("/", reciepeController_1.getRecipes);
router.get("/:id", authMiddleware_1.default, reciepeController_1.getRecipeById);
router.put("/:id/reactions", reciepeController_1.updateRecipeReactions);
router.get("/:id/similar", reciepeController_1.findSimilarRecipesByCategory);
exports.default = router;
