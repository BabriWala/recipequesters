import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Ensure this is the correct import for your axios instance
import axiosClient from "../../axios/axiosClient";
import axios from "axios";
import toast from "react-hot-toast";
import { refetchedUserData } from "../../services/refetchedUserData";
import { saveState } from "../../middleware/sessionStorage";
import { loginUserSuccess } from "../../actions/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  imageUrl: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Image is required."),
  details: z.string().min(1, "Details are required."),
  country: z.string().min(1, "Country is required."),
  youtubeLink: z.string().url().optional(),
  category: z.enum(["Beef", "Chicken", "Rice", "Vegetables"], {
    required_error: "Category is required.",
  }),
  recipeName: z.string().min(1, "Recipe name is required."),
});

const AddRecipe = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const createRecipe = async ({ recipeData, token }) => {
    const { data } = await axiosClient.post("recipes/", recipeData);
    return data;
  };

  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: async () => {
      toast.success("recipe created successfully");
      const response = await refetchedUserData(user?.accessToken);
      saveState(user?.data);
      dispatch(loginUserSuccess(response?.data));
      navigate("/recipe");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  const onSubmit = async (data) => {
    if (user?.accessToken) {
      const imageformData = new FormData();
      imageformData.append("image", data.imageUrl[0]);
      try {
        const imgBBApiKey = import.meta.env.VITE_IMGBBAPIKEY;
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgBBApiKey}`,
          imageformData
        );
        if (response?.data?.data?.display_url) {
          // const formData = new FormData();
          const newUrl = response?.data?.data?.display_url;
          const updatedData = {
            ...data,
            imageUrl: newUrl,
          };

          mutation.mutate({ recipeData: updatedData, token: user.accessToken });
        }
      } catch (error) {}
    }
  };

  return (
    <div className="container py-10 px-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" w-3/4 grid grid-cols-2  gap-5 border mx-auto p-4 bg-white shadow-md rounded"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image URL
          </label>
          <input
            type="file"
            {...register("imageUrl")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.imageUrl.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Details
          </label>
          <textarea
            {...register("details")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.details && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.details.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Country
          </label>
          <input
            {...register("country")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.country && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.country.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            YouTube Link
          </label>
          <input
            {...register("youtubeLink")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.youtubeLink && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.youtubeLink.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            {...register("category")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Beef">Beef</option>
            <option value="Chicken">Chicken</option>
            <option value="Rice">Rice</option>
            <option value="Vegetables">Vegetables</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.category.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recipe Name
          </label>
          <input
            {...register("recipeName")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.recipeName && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.recipeName.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className={`w-full col-span-2 py-2 px-4 rounded ${
            mutation.isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold focus:outline-none focus:shadow-outline`}
        >
          {mutation.isPending ? "Creating..." : "Create Recipe"}
        </button>
        {mutation.isError && (
          <p className="text-red-500 text-xs italic mt-4">
            Error: {mutation.error.message}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="text-green-500 text-xs italic mt-4">
            Recipe created successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default AddRecipe;
