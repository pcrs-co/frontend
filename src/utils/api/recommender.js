// src/utils/api/recommender.js

import api from "../api";
import { v4 as uuidv4 } from 'uuid';

// Helper to get or create a session_id for anonymous users
const getSessionId = () => {
    let sessionId = localStorage.getItem('recommender_session_id');
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('recommender_session_id', sessionId);
    }
    return sessionId;
};

// --- THIS IS NOW THE ONLY STARTING POINT ---
/**
 * Submits user activities and gets the generated specs back in one go.
 * @param {object} activitiesPayload - e.g., { primary_activity: 'Gaming', secondary_activities: ['Streaming'] }
 */
export const generateAndFetchSpecs = async (activitiesPayload) => {
    const sessionId = getSessionId();
    const payload = {
        ...activitiesPayload,
        session_id: sessionId,
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

// ... add this new function
export const fetchUserRecommendationHistory = async () => {
    const { data } = await api.get('/history/recommendations/');
    return data;
};