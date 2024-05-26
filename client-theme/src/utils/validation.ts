// src/utils/validation.ts
import { z } from "zod";

export const recipeSchema = z.object({
  creatorEmail: z.string().email("Invalid email"),
  imageUrl: z.string().url("Invalid URL"),
  details: z.string().min(10, "Details should be at least 10 characters long"),
  country: z.string().min(2, "Country should be at least 2 characters long"),
  youtubeLink: z.string().url("Invalid URL"),
  category: z.string().min(3, "Category should be at least 3 characters long"),
});
