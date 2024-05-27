// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import axiosClient from "../../../axios/axiosClient";

const fetchUserData = async (userId: string) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

export const useUserData = (userId: string) => {
  return useQuery(["user", userId], () => fetchUserData(userId), {
    enabled: !!userId, // Only run this query if userId exists
  });
};

const createRecipe = async (recipeData: any, token: string) => {
  console.log(recipeData, token);
  // const { data } = await axiosClient.post("recipes", recipeData, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   },
  // });
  // return data;
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ recipeData, token }: { recipeData: any; token: string }) =>
      createRecipe(recipeData, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
      },
    }
  );
};
