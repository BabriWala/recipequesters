// src/features/recipes/recipeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Reaction {
  type: string;
  count: number;
}

interface Purchase {
  email: string;
  time: Date;
}

interface Recipe {
  _id: string;
  creatorEmail: string;
  imageUrl: string;
  details: string;
  reactions: Reaction[];
  purchases: Purchase[];
  country: string;
  youtubeLink: string;
  category: string;
  watchedTimes: number;
}

interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await axios.get("/api/recipes");
    return response.data;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecipes.fulfilled,
        (state, action: PayloadAction<Recipe[]>) => {
          state.recipes = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recipes";
      });
  },
});

export default recipeSlice.reducer;
