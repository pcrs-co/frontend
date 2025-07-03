// src/utils/api/recommender.js

import api from "../api";

// --- THIS IS NOW THE ONLY STARTING POINT ---
/**
 * Submits user activities and gets the generated specs back in one go.
 * @param {object} activitiesPayload - e.g., { primary_activity: 'Gaming', secondary_activities: ['Streaming'] }
 */
export const generateAndFetchSpecs = async (activitiesPayload) => {

    const payload = {
        ...activitiesPayload,
    };

    // This single POST request now triggers the entire backend process.
    const { data } = await api.post("/recommend/", payload);
    return data;
};

// The 'fetchRecommendedProducts' function for the Results page
// +++ CHANGE: It now accepts filter parameters +++
export const fetchRecommendedProducts = async (filters = {}) => {
    const sessionId = localStorage.getItem('recommender_session_id');
    const params = new URLSearchParams();

    if (sessionId) {
        params.append('session_id', sessionId);
    }
    if (filters.spec_level) {
        params.append('spec_level', filters.spec_level);
    }
    if (filters.max_price) {
        params.append('max_price', filters.max_price);
    }

    const { data } = await api.get(`/recommend_product/?${params.toString()}`);
    return data;
};

// ++ ADD THIS NEW FUNCTION ++
export const fetchLatestRecommendation = async () => {
    const sessionId = localStorage.getItem('recommender_session_id');
    const queryParams = sessionId ? `?session_id=${sessionId}` : '';

    // The backend prioritizes the user from the auth token if available
    const { data } = await api.get(`/recommend/latest/${queryParams}`);
    return data;
};

export const fetchUserRecommendationHistory = async () => {
    // This URL must match what you defined in the backend urls.py
    const { data } = await api.get('/history/recommendations/');
    return data;
};