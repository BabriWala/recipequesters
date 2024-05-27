// @ts-nocheck
import axiosClient from "../axios/axiosClient";

export const refetchedUserData = async (token) => {
  try {
    const response = await axiosClient.get("users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); // Adjust endpoint as needed

    // Save state and dispatch fetch success action
    return response;
  } catch (err) {
    console.log(err);
  }
};
