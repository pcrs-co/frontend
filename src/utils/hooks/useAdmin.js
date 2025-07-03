import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAdminResource,
    createAdminResource,
    updateAdminResource,
    deleteAdminResource,
} from "../api/admin";

// This single hook can manage any admin resource (benchmarks, apps, etc.)
export const useAdminResource = (resource) => {
    const queryClient = useQueryClient();
    const queryKey = ["admin", resource];

    // Fetch all items for the resource
    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn: () => fetchAdminResource(resource),
        enabled: !!resource, // Only run if a resource is specified
    });

    // Mutation to create a new item
    const { mutate: addItem, isPending: isAdding } = useMutation({
        mutationFn: (payload) => createAdminResource({ resource, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Mutation to update an item
    const { mutate: updateItem, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, payload }) => updateAdminResource({ resource, id, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Mutation to delete an item
    const { mutate: deleteItem, isPending: isDeleting } = useMutation({
        mutationFn: (id) => deleteAdminResource({ resource, id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        data,
        isLoading,
        error,
        addItem,
        isAdding,
        updateItem,
        isUpdating,
        deleteItem,
        isDeleting,
    };
};