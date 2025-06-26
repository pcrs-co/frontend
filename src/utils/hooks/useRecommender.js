// src/utils/hooks/useRecommender.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import {
    submitUserPreferences,
    generateAndFetchSpecs
} from "../api/recommender";

export const useRecommender = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { mutate: startRecommendation, isPending } = useMutation({
        // This mutation function will perform all steps in sequence!
        mutationFn: async (preferences) => {
            // Step 1: Submit preferences
            await submitUserPreferences(preferences);
            
            // Step 2: Generate and fetch the specs
            // We return this data to the onSuccess callback
            const specData = await generateAndFetchSpecs();
            return specData;
        },
        onSuccess: (specData) => {
            // This runs after the entire mutationFn succeeds
            showToast({ message: "Specifications generated successfully!", type: "success" });
            
            // Cache the spec data so the results page can access it immediately
            queryClient.setQueryData(['generatedSpecs'], specData);
            
            // Navigate the user to the results page
            navigate('/results');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.error || error.message || "An unknown error occurred.";
            showToast({ message: `Analysis failed: ${errorMessage}`, type: "error" });
        },
    });

    return { startRecommendation, isPending };
};