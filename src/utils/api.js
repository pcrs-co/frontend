import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ====================================================================
// --- 1. Request Interceptor ---
// This runs BEFORE each request is sent.
// ====================================================================
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem(ACCESS_TOKEN);
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues)
    return Promise.reject(error);
  }
);

const refreshUrl = `${api.defaults.baseURL}/token/refresh/`;

// Add auth token to requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bypass refresh logic for login and refresh endpoints
    const isAuthRequest =
      originalRequest.url.includes("/token/") &&
      !originalRequest._retry;

    if (
      error.response?.status === 401 &&
      !isAuthRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(refreshUrl, {
          refresh: refreshToken,
        });

        localStorage.setItem(ACCESS_TOKEN, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;