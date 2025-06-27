// src/utils/hooks/useRecommender.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
// --- CHANGE: We only need one API function now ---
import { generateAndFetchSpecs } from "../api/recommender";

export const useRecommender = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // The mutation is now simpler and more direct.
    const { mutate: startRecommendation, isPending } = useMutation({
        // The mutation function now just calls our single, powerful backend endpoint.
        // It passes the user's activities directly.
        mutationFn: generateAndFetchSpecs,

        onSuccess: (specData) => {
            // This logic remains the same! It runs after the single API call succeeds.
            showToast({ message: "Specifications generated successfully!", type: "success" });

            // Cache the spec data so the results page can access it instantly
            queryClient.setQueryData(['generatedSpecs'], specData);

            // Navigate the user to the results page
            navigate('/results');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || "An unknown error occurred.";
            showToast({ message: `Analysis failed: ${errorMessage}`, type: "error" });
        },
    });

    return { startRecommendation, isPending };
};