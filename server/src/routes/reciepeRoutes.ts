// src/routes/recipeRoutes.ts
import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipeReactions,
  findSimilarRecipesByCategory,
} from "../controllers/reciepeController";

const router = Router();

router.post("/", createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id/reactions", updateRecipeReactions);
router.get("/:id/similar", findSimilarRecipesByCategory);

export default router;
