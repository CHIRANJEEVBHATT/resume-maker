// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../config/apiPaths";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from stored token
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);
  // Fetch user profile if token exists
  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setUser(data?.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        await fetchProfile();
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Register
  const register = async (payload) => {
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUser = async (payload) => {
    try {
      const { data } = await axiosInstance.put(API_PATHS.AUTH.UPDATE, payload);
      setUser(data?.user || user); // update context with new user data
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Expose manual refresh via fetchProfile only; initial load handled above

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateUser, // 🔥 new function here
        logout,
        fetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
