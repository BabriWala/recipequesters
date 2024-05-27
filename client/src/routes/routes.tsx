import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Recipe from "../pages/Recipe/Recipe";
import BuyCoin from "../pages/BuyCoin/BuyCoin";
import AddRecipe from "../pages/AddRecipe/AddRecipe";
import NotFound from "../pages/NotFound/NotFound";
import Layout from "../Layout/Layout";
import AuthChecker from "../component/AuthChecker/AuthChecker";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/recipe", element: <Recipe /> },
      { path: "/buy-coin", element: <AuthChecker><BuyCoin /></AuthChecker> },
      { path: "/add-recipe", element: <AuthChecker><AddRecipe /></AuthChecker> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
