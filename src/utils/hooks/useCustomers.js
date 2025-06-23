import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// We can reuse the generic admin API functions!
import {
    fetchAdminResource,
    updateAdminResource,
    deleteAdminResource
} from '../api/admin';

const RESOURCE_NAME = 'customers';
const QUERY_KEY = ['admin', RESOURCE_NAME];

// Hook to fetch a single customer's details
export const useCustomerDetails = (customerId) => {
    return useQuery({
        // e.g., ['admin', 'customers', '123']
        queryKey: [...QUERY_KEY, customerId],
        queryFn: () => fetchAdminResource(`${RESOURCE_NAME}/${customerId}`), // Note: We need a slight modification to fetchAdminResource to handle this
        enabled: !!customerId,
    });
};

// Hook to perform actions (update, delete) on customers
export const useCustomerActions = () => {
    const queryClient = useQueryClient();

    // Invalidate the main list of customers
    const invalidateList = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    };

    // Mutation to update a customer
    const { mutate: updateCustomer, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, payload }) => updateAdminResource({ resource: RESOURCE_NAME, id, payload }),
        onSuccess: (_, { id }) => {
            invalidateList();
            // Also invalidate the specific customer's detail query
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
        },
    });

    // Mutation to delete a customer
    const { mutate: deleteCustomer, isPending: isDeleting } = useMutation({
        mutationFn: (id) => deleteAdminResource({ resource: RESOURCE_NAME, id }),
        onSuccess: invalidateList,
    });

    return {
        updateCustomer, isUpdating,
        deleteCustomer, isDeleting,
    };
};