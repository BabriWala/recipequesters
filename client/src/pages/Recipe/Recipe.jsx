// src/components/RecipeList.jsx
import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { throttle } from "lodash";
import axiosClient from "../../axios/axiosClient";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Recipe = () => {
  const user = useSelector((state) => state.user);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    country: "",
    recipeName: "",
  });

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await axiosClient.get("recipes/", {
        params: {
          ...filters,
          page,
          limit: 10,
        },
      });

      if (response.data.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setRecipes((prevRecipes) =>
        page === 1 ? response.data : [...prevRecipes, ...response.data]
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleFilterChange = useCallback(
    throttle((e) => {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
      setPage(1);
    }, 500),
    []
  );
  const navigate = useNavigate();
  const viewDetails = (recipe) => {
    if (!user?.user?.email) {
      toast.error("You have to logged in for viewing Details, Pleasle login");
      return null;
    }
    if (recipe.creatorEmail == user?.user.email) {
      navigate(`/recipe/${recipe._id}`);
      return null;
    }
    if (
      recipe.purchases &&
      recipe.purchases.length > 0 &&
      recipe.purchases.map((it) => it.email).includes(user?.user?.email)
    ) {
      navigate(`/recipe/${recipe._id}`);
      return null;
    }

    if (Number(user?.user?.coins) < 10) {
      toast("You Have not Enough Coins For Viewing This Recpie Buy Coins");
      navigate("/purchase-coin");
      return null;
    }

    if (Number(user?.user?.coins) >= 10) {
      const confirmed = window.confirm(
        "Your sure you want to see the details then 10 coins will be cutted"
      );
      if (confirmed) {
        navigate(`/recipe/${recipe._id}`);
        return;
      }
    }
  };

  return (
    <div className=" container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-5">All Recipe List</h2>
      <div className="grid grid-cols-3 gap-5">
        <input
          type="text"
          name="recipeName"
          className="w-full py-2 pl-4 border text-sm rounded-md sm:w-auto focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50 focus:dark:border-violet-600"
          placeholder="Search by recipe name"
          onChange={handleFilterChange}
        />
        <select
          name="category"
          className="w-full py-2 pl-4 border text-sm rounded-md sm:w-auto focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50 focus:dark:border-violet-600"
          onChange={handleFilterChange}
          defaultValue=""
        >
          <option value="">All</option>
          <option value="Beef">Beef</option>
          <option value="Chicken">Chicken</option>
          <option value="Rice">Rice</option>
          <option value="Vegetables">Vegetables</option>
        </select>

        <input
          type="text"
          name="country"
          className="w-full py-2 pl-4 border text-sm rounded-md sm:w-auto focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50 focus:dark:border-violet-600"
          placeholder="Country"
          onChange={handleFilterChange}
        />
      </div>
      <InfiniteScroll
        dataLength={recipes.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more recipes</p>}
      >
        <div className="grid grid-cols-1 gap-6 py-10">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border border-gray-300 p-4 grid grid-cols-3 rounded-lg gap-20  py-10 items-center shadow-md"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.recipeName}
                className="w-full h-full object-cover rounded-md my-4"
              />
              <div className="col-span-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Icon
                    className="w-5 h-5"
                    icon="arcticons:recipe-keeper"
                  ></Icon>{" "}
                  <span>{recipe.recipeName}</span>
                </h3>
                <p className="text-gray-600  flex items-center gap-2">
                  <Icon icon="tabler:category-2"></Icon>{" "}
                  <span>{recipe.category}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Icon icon="carbon:email"></Icon>{" "}
                  <span>{recipe.creatorEmail}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Icon icon="fluent-mdl2:world"></Icon>{" "}
                  <span>{recipe.country}</span>
                </p>
                <ul className="list-disc list-inside">
                  {recipe.purchases.length > 0 &&
                    recipe.purchases.map((purchase, index) => (
                      <li key={index} className="text-gray-700">
                        {purchase.email} -{" "}
                        {formatDistanceToNow(new Date(purchase.time), {
                          addSuffix: true,
                        })}
                      </li>
                    ))}
                </ul>
                <button
                  onClick={() => viewDetails(recipe)}
                  className="mt-4 bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600 flex items-center gap-2"
                >
                  <Icon icon="iconamoon:send-light"></Icon>
                  <span> View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Recipe;
