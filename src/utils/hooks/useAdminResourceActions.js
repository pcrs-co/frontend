import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createAdminResource,
    updateAdminResource,
    deleteAdminResource,
} from '../api/admin';

// This one hook can perform actions on ANY admin resource.
export const useAdminResourceActions = (resource) => {
    const queryClient = useQueryClient();

    // The dynamic "magic" function
    const invalidateResourceList = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', resource] });
    };

    const { mutate: addItem, isPending: isAdding } = useMutation({
        mutationFn: (payload) => createAdminResource({ resource, payload }),
        onSuccess: invalidateResourceList,
    });

    const { mutate: updateItem, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, payload }) => updateAdminResource({ resource, id, payload }),
        onSuccess: invalidateResourceList,
    });

    const { mutate: deleteItem, isPending: isDeleting } = useMutation({
        mutationFn: (id) => deleteAdminResource({ resource, id }),
        onSuccess: invalidateResourceList,
    });

    return {
        addItem, isAdding,
        updateItem, isUpdating,
        deleteItem, isDeleting,
    };
};