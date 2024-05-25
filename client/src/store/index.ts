// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import recipeReducer from "./recipeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
