// axiosInstance.ts
import axios from "axios";
import refreshToken from "../api/refreshToken/refreshToken";
import store from "../store/store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Replace with your API base URL
  // Add any other default configurations
});

const getExpiredRefreshToken = () => {
  const state = store.getState();
  return state?.user?.user?.refreshToken; // Assuming your refresh token is stored in the auth slice of your Redux store
};

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Assuming you have access to the expired refresh token in Redux store
      const expiredRefreshToken = getExpiredRefreshToken();
      const newToken = await refreshToken(expiredRefreshToken);
      // Update the Authorization header with the new token
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newToken}`;
      // Retry the original request with the new token
      return axiosClient(originalRequest);
    }
    // If the error is not related to token expiration, just throw it
    throw error;
  }
);

export default axiosClient;
