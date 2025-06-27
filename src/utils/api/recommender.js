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

// The 'fetchRecommendedProducts' function for the Results page remains the same.
export const fetchRecommendedProducts = async () => {
    const sessionId = localStorage.getItem('recommender_session_id');
    const queryParams = sessionId ? `?session_id=${sessionId}` : '';
    const { data } = await api.get(`/recommend_product/${queryParams}`);
    return data;
};