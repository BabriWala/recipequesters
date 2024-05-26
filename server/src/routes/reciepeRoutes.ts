// src/routes/recipeRoutes.ts
import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipeReactions,
  findSimilarRecipesByCategory,
} from "../controllers/reciepeController";
import verifyToken from "../middlewares/authMiddleware";

const router = Router();

router.post("/", createRecipe);
router.get("/", getRecipes);
router.get("/:id", verifyToken, getRecipeById);
router.put("/:id/reactions", updateRecipeReactions);
router.get("/:id/similar", findSimilarRecipesByCategory);

export default router;
