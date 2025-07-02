// src/utils/hooks/useRecommender.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { generateAndFetchSpecs } from "../api/recommender";

export const useRecommender = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { mutate: startRecommendation, isPending } = useMutation({
        mutationFn: generateAndFetchSpecs,

        onSuccess: (newSpecData) => {
            showToast({ message: "Specifications generated successfully!", type: "success" });

            // Invalidate any old recommendation queries to ensure stale data is cleared.
            queryClient.invalidateQueries({ queryKey: ['latestRecommendation'] });

            // Pass the fresh data directly to the results page via navigation state.
            // This is the most reliable way to ensure the correct data is shown,
            // bypassing any potential caching issues for anonymous or repeat users.
            navigate('/results', {
                state: {
                    specData: newSpecData,
                    // A timestamp forces React Router to see this as a new navigation event.
                    timestamp: new Date().getTime()
                }
            });
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.detail || "An unexpected error occurred during analysis.";
            showToast({ message: errorMessage, type: "error" });
        },
    });

    return { startRecommendation, isPending };
};