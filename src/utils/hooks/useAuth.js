import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, fetchUserProfile, updateUserProfile } from "../api/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const useAuth = () => {
    const queryClient = useQueryClient();

    const token = localStorage.getItem(ACCESS_TOKEN);
    let decodedToken = null;
    try {
        decodedToken = token ? jwtDecode(token) : null;
    } catch (e) {
        console.error("Invalid token:", e);
    }

    const userRole = decodedToken?.role || null;
    const userId = decodedToken?.user_id || null;

    const { data: user, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ["userProfile", { role: userRole }],
        queryFn: fetchUserProfile, // Correctly points to the simplified function
        enabled: !!token,
        retry: 2, // It's good practice to keep a retry
        staleTime: 5 * 60 * 1000,
    });

    // --- Data Mutations ---

    // ** THIS IS THE FIX **
    // Mutation for user login. It should call `loginUser`.
    const { mutate: login, isPending: isLoggingIn } = useMutation({
        mutationFn: loginUser, // <-- CORRECTED: Was pointing to updateUserProfile
        onSuccess: () => {
            // After successful login, invalidate the userProfile query to force a refetch.
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });

    const { mutate: register, isPending: isRegistering } = useMutation({
        mutationFn: registerUser,
    });

    // Mutation for updating the user's profile. It should call `updateUserProfile`.
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: updateUserProfile, // Correctly points to the simplified function
        onSuccess: (updatedData) => {
            // Optimistically update the cache for a snappy UI response
            queryClient.setQueryData(["userProfile", { role: userRole }], updatedData);
        },
    });

    // --- Authentication Actions ---
    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        queryClient.clear();
        window.location.href = "/";
    };

    // --- Returned Values ---
    return {
        user,
        userRole,
        userId,
        isLoading,
        isError,
        error,
        isAuthenticated: isSuccess && !!user,
        login,
        isLoggingIn,
        register,
        isRegistering,
        logout,
        updateProfile,
        isUpdatingProfile,
    };
};