import axiosClient from "../axios/axiosClient";

export const refetchedUserData = async () => {
  try {
    const response = await axiosClient.get("users/me"); // Adjust endpoint as needed

    // Save state and dispatch fetch success action
    return response;
  } catch (err) {}
};
