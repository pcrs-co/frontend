// src/utils/hooks/useSuggestions.js
import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions } from '../api/suggestions';

export const useSuggestions = () => {
    // useQuery is the perfect tool for this. It handles caching,
    // loading states, and error states for you automatically.
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['suggestions'],
        queryFn: fetchSuggestions,
        // The suggestion list doesn't change every second. Let's cache it for a while
        // to prevent API calls on every navigation. 1 hour is a good default.
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        // Provide a default empty structure to prevent errors on the first render
        initialData: { activities: [] },
    });

    return {
        // We rename 'data' to 'suggestions' for clarity in the components.
        suggestions: data,
        isLoading,
        isError,
        error,
    };
};