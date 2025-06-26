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

/**
 * STEP 1: Submits the user's chosen activities and applications.
 */
export const submitUserPreferences = async (preferences) => {
    const sessionId = getSessionId();
    const payload = {
        ...preferences,
        session_id: sessionId,
    };
    // This endpoint saves the preferences
    const { data } = await api.post("/user_preference/", payload);
    return data;
};

/**
 * STEP 2: Triggers spec generation and fetches the result.
 */
export const generateAndFetchSpecs = async () => {
    // For logged-in users, the auth token is enough.
    // For anonymous users, the backend needs the session_id to find their preference.
    const sessionId = localStorage.getItem('recommender_session_id');
    const payload = sessionId ? { session_id: sessionId } : {};

    const { data } = await api.post("/recommend/", payload);
    return data;
};

/**
 * STEP 3: Fetches the final list of products based on the generated specs.
 */
export const fetchRecommendedProducts = async () => {
    const sessionId = localStorage.getItem('recommender_session_id');

    // We can construct a query param string that works for both cases
    // The backend will prioritize the user from the token if available
    const queryParams = sessionId ? `?session_id=${sessionId}` : '';

    const { data } = await api.get(`/recommend_product/${queryParams}`);
    return data;
};