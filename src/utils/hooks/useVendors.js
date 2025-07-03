// src/utils/hooks/useVendors.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as vendorApi from '../api/vendors';

// A single, consistent query key for all vendor-related data
const VENDORS_QUERY_KEY = 'vendors';

// Hook to fetch the list of all vendors
export const useVendorsList = () => {
    return useQuery({
        queryKey: [VENDORS_QUERY_KEY],
        queryFn: vendorApi.getVendors,
    });
};

// Hook to fetch a single vendor by ID
export const useVendorDetails = (vendorId) => {
    return useQuery({
        queryKey: [VENDORS_QUERY_KEY, vendorId],
        queryFn: () => vendorApi.getVendor(vendorId),
        enabled: !!vendorId, // Only run the query if a vendorId is provided
    });
};

// Hook for performing actions (create, update, delete) on vendors
export const useVendorActions = () => {
    const queryClient = useQueryClient();

    // A function to invalidate the cache and force a refetch of the vendor list
    const invalidateVendorList = () => {
        queryClient.invalidateQueries({ queryKey: [VENDORS_QUERY_KEY] });
    };

    const { mutate: createVendor, isPending: isCreating } = useMutation({
        mutationFn: vendorApi.createVendor,
        onSuccess: invalidateVendorList, // Refetch the list on success
    });

    const { mutate: updateVendor, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, data }) => vendorApi.updateVendor(id, data),
        onSuccess: (_, { id }) => {
            invalidateVendorList(); // Refetch the list
            // Also invalidate the specific vendor's detail query cache
            queryClient.invalidateQueries({ queryKey: [VENDORS_QUERY_KEY, id] });
        },
    });

    const { mutate: deleteVendor, isPending: isDeleting } = useMutation({
        mutationFn: vendorApi.deleteVendor,
        onSuccess: invalidateVendorList,
    });

    return {
        createVendor, isCreating,
        updateVendor, isUpdating,
        deleteVendor, isDeleting,
    };
};