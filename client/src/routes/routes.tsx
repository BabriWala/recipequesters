import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Recipe from "../pages/Recipe/Recipe";
import BuyCoin from "../pages/BuyCoin/BuyCoin";
import AddRecipe from "../pages/AddRecipe/AddRecipe";
import NotFound from "../pages/NotFound/NotFound";
import Layout from "../Layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "recipe", element: <Recipe /> },
      { path: "buy-coin", element: <BuyCoin /> },
      { path: "add-recipe", element: <AddRecipe /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
