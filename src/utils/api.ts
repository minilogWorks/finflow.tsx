import axios from "axios";
import { StorageService } from "../services/StorageService";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", // adjust to your backend URL
});

// Store tokens in localStorage (or use secure httpOnly cookies if possible)
// const setTokens = (access, refresh) => {
//   localStorage.setItem('access_token', access);
//   if (refresh) localStorage.setItem('refresh_token', refresh);
// };

// const getAccessToken = () => localStorage.getItem('access_token');
// const getRefreshToken = () => localStorage.getItem('refresh_token');
// const removeTokens = () => {
//   localStorage.removeItem('access_token');
//   localStorage.removeItem('refresh_token');
// };

// Request interceptor: add Bearer token
api.interceptors.request.use((config) => {
  const token = StorageService.getTokens();
  if (token) {
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
});

// Response interceptor: handle 401 by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop

      const tokens = StorageService.getTokens();
      if (!tokens) {
        // No refresh token → user must log in again
        StorageService.deleteTokens();
        window.location.href = "/login"; // or use navigate()
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: tokens.refreshToken,
          }
        );

        const newAccessToken = res.data.access;
        // Optional: new refresh if using rotation
        // if (res.data.refresh) setTokens(newAccessToken, res.data.refresh);
        // else
        StorageService.updateAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        StorageService.deleteTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
