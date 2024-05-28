// src/components/RecipeList.jsx
import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { throttle } from "lodash";
import axiosClient from "../../axios/axiosClient";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { refetchedUserData } from "../../services/refetchedUserData";
import { saveState } from "../../middleware/sessionStorage";
import { loginUserSuccess } from "../../actions/actions";

const getYouTubeEmbedUrl = (url) => {
  const videoId = url?.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}`;
};

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
  });

  const user = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const fetchRecipes = async () => {
    try {
      const response = await axiosClient.get(`recipes/${id}`);
      setRecipe(response.data);
      const userResponse = await refetchedUserData();
      saveState(userResponse?.data);
      dispatch(loginUserSuccess(userResponse?.data));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [id]);

  const fetchSimilarRecipes = useCallback(async () => {
    try {
      const response = await axiosClient.get("recipes/", {
        params: {
          ...filters,
          page,
          limit: 10,
        },
      });

      setRecipes((prevRecipes) =>
        page === 1 ? response.data : [...prevRecipes, ...response.data]
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [filters]);
  useEffect(() => {
    fetchSimilarRecipes();
  }, [fetchSimilarRecipes]);
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ["category"]: recipe?.category,
    }));
  }, [recipe]);

  const [likes, setLikes] = useState(recipe?.reactions?.length);
  const [liked, setLiked] = useState(false);
  console.log(recipe);
  const handleLike = async () => {
    const isAdded =
      recipe?.reactions?.length > 0 &&
      recipe.reactions &&
      recipe.reactions
        .map((it) => {
          console.log(it);
          return it.userId;
        })
        .includes(user.user._id);
    console.log(isAdded);
    const data = {
      reactionType: "Like",
      action: isAdded ? "remove" : "add",
    };
    try {
      const response = await axiosClient.put(`recipes/${id}/reactions`, data);
    } catch (err) {
      fetchRecipes();
    }
  };
  return (
    <>
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-5">All Recipe List</h2>

        <div
          key={recipe._id}
          className="border border-gray-300 p-4 grid grid-cols-3 rounded-lg gap-20 py-10 items-center shadow-md"
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.recipeName}
            className="w-full h-full object-cover rounded-md my-4"
          />
          <div className="col-span-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Icon className="w-5 h-5" icon="arcticons:recipe-keeper" />
              <span>{recipe.recipeName}</span>
            </h3>
            <p className="text-gray-600 flex items-center gap-2">
              <Icon icon="tabler:category-2" />
              <span>{recipe.category}</span>
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <Icon icon="carbon:email" />
              <span>{recipe.creatorEmail}</span>
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <Icon icon="fluent-mdl2:world" />
              <span>{recipe.country}</span>
            </p>
            <ul className="list-disc list-inside">
              {recipe?.purchases?.length > 0 &&
                recipe?.purchases?.map((purchase, index) => (
                  <li key={index} className="text-gray-700">
                    {purchase.email} -{" "}
                    {formatDistanceToNow(new Date(purchase.time), {
                      addSuffix: true,
                    })}
                  </li>
                ))}
            </ul>
            <button
              onClick={handleLike}
              className={`mt-4 px-4 py-2 ${
                liked ? "bg-red-500" : "bg-blue-500"
              } text-white rounded-lg`}
            >
              {liked ? "Unlike" : "Like"} <span>{likes}</span>
            </button>
            <div className="mt-4">
              <iframe
                width="560"
                height="315"
                src={getYouTubeEmbedUrl(recipe.youtubeLink)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64 rounded-md"
                onLoad={() => {}}
              ></iframe>
            </div>
            <p className="text-gray-600 mt-2">
              Watched {recipe.watchedTimes} times
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <h3 className="text-2xl font-bold">Simliar Recipe</h3>
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
      </div>
    </>
  );
};

export default RecipeDetails;
