import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, fetchUserProfile, updateUserProfile } from "../api/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const useAuth = () => {
    const queryClient = useQueryClient();

    // Fetch current user's profile
    const { data: user, isLoading, error } = useQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserProfile,
        retry: 1, // Don't retry endlessly if the user is not logged in
        enabled: !!localStorage.getItem(ACCESS_TOKEN), // Only run if a token exists
    });

    // Mutation for user login
    const { mutate: login, isPending: isLoggingIn } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            // Invalidate user profile query to refetch with new credentials
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });

    // Mutation for user registration
    const { mutate: register, isPending: isRegistering } = useMutation({
        mutationFn: registerUser,
    });

    // Mutation for updating user profile
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedData) => {
            // Update the cache immediately with the new data
            queryClient.setQueryData(["userProfile"], updatedData);
        },
    });

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem("user_role"); // Clear the role
        queryClient.setQueryData(["userProfile"], null); // Clear user data from cache
        window.location.href = "/signin"; // Redirect
    };

    return {
        user,
        isLoading,
        error,
        login,
        isLoggingIn,
        register,
        isRegistering,
        updateProfile,
        isUpdatingProfile,
        logout,
        isAuthenticated: !!user,
    };
};