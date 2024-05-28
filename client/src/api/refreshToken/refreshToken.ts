// refreshToken.ts

import axiosClient from "../../axios/axiosClient";

const refreshToken = async (expiredRefreshToken) => {
  // Implement logic to refresh the token
  try {
    const response = await axiosClient.post("refresh-token/", {
      refreshToken: expiredRefreshToken,
      // You might need to include other data like client ID or secret, user ID, etc.
    });
    return response.data.accessToken;
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};

export default refreshToken;
