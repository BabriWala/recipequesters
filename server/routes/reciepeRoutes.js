const express = require("express");
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipeReactions,
  findSimilarRecipesByCategory,
} = require("../controllers/reciepeController");

const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();
router.post("/", createRecipe);
router.get("/", getRecipes);
router.get("/:id", authMiddleware, getRecipeById);
router.put("/:id/reactions", updateRecipeReactions);
router.get("/:id/similar", findSimilarRecipesByCategory);

module.exports = router;
