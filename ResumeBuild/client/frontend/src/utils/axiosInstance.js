// src/utils/axiosInstance.js
import axios from "axios";
import { BASE_URL } from "../config/apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid → logout user
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout - server took too long to respond");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
