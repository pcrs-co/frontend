import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    submitUserPreferences,
    generateRecommendations,
    fetchRecommendedProducts,
} from "../api/recommender";

export const useRecommendations = () => {
    const queryClient = useQueryClient();

    // Fetch final recommendations
    const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
        queryKey: ["recommendations"],
        queryFn: fetchRecommendedProducts,
        enabled: false, // Initially disabled, only run when triggered
    });

    // Mutation to submit preferences
    const { mutate: submitPreferences, isPending: isSubmitting } = useMutation({
        mutationFn: submitUserPreferences,
        onSuccess: () => {
            // After submitting, trigger the generation
            generate();
        }
    });

    // Mutation to trigger the generation process
    const { mutate: generate, isPending: isGenerating } = useMutation({
        mutationFn: generateRecommendations,
        onSuccess: () => {
            // After generation is triggered, invalidate the recommendations query to fetch them
            queryClient.invalidateQueries({ queryKey: ["recommendations"] });
        },
    });

    return {
        recommendations,
        isLoadingRecommendations,
        submitPreferences,
        isSubmitting,
        isGenerating,
    };
};