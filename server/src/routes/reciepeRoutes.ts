// src/routes/recipeRoutes.ts
import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipeReactions,
  addPurchase,
  getSuggestedRecipes,
} from "../controllers/reciepeController";

const router = Router();

router.post("/", createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id/reactions", updateRecipeReactions);
router.post("/:id/purchase", addPurchase);
router.get("/suggestions", getSuggestedRecipes);

export default router;
