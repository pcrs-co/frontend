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

// --- THIS IS THE MAIN CHANGE ---
// This function no longer needs the 'role' parameter because the endpoint is the same for everyone.
export const fetchUserProfile = async () => {
    // Always call the single, unified profile endpoint.
    const { data } = await api.get("/profile/");
    return data;
};

// This function also no longer needs the 'role' parameter.
export const updateUserProfile = async (profileData) => {
    // Always send updates to the single, unified profile endpoint.
    const { data } = await api.put("/profile/", profileData);
    return data;
};