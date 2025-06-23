import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const loginUser = async (credentials) => {
    const { data } = await api.post("/token/", credentials);
    localStorage.setItem(ACCESS_TOKEN, data.access);
    localStorage.setItem(REFRESH_TOKEN, data.refresh);
    return data;
};

export const registerUser = async (userData) => {
    const { data } = await api.post("/register/", userData);
    return data;
};

export const fetchUserProfile = async () => {
    // Assuming a role is stored somewhere to decide which profile to fetch
    // This logic can be improved based on your app's state management
    const userRole = localStorage.getItem("user_role"); // Example
    const endpoint = userRole === 'vendor' ? "/vendor/profile/" : "/user/profile/";
    const { data } = await api.get(endpoint);
    return data;
};

export const updateUserProfile = async (profileData) => {
    const userRole = localStorage.getItem("user_role"); // Example
    const endpoint = userRole === 'vendor' ? "/vendor/profile/" : "/user/profile/";
    const { data } = await api.put(endpoint, profileData);
    return data;
};