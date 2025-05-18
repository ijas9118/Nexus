import { refreshAccessToken } from "@/store/slices/authSlice";
import store from "@/store/store";
import { HOST } from "@/utils/constants";
import axios from "axios";

const api = axios.create({
  baseURL: HOST + "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        // Dispatch refresh token thunk
        const newToken = await store.dispatch(refreshAccessToken()).unwrap();

        // Explicitly update headers for retry request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest); // Retry with updated request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
