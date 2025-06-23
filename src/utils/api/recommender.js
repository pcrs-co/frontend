import api from "../api";

// For a user to submit their preferences/answers
export const submitUserPreferences = async (preferences) => {
    const { data } = await api.post("/user_preference/", preferences);
    return data;
};

// To trigger the recommendation generation
export const generateRecommendations = async () => {
    const { data } = await api.post("/recommend/");
    return data;
};

// To fetch the final recommended products
export const fetchRecommendedProducts = async () => {
    const { data } = await api.get("/recommend_product/");
    return data;
};