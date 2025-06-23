import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productApi from '../api/products';

const queryKey = 'adminProducts';

/**
 * Hook to fetch a paginated list of ALL products.
 * @param {number} page - The page number to fetch.
 * @param {string|null} vendorId - Optional vendor ID to filter by.
 */
export const useAdminProductsList = (page = 1, vendorId = null) => {
    return useQuery({
        // The query key is dynamic based on filters
        queryKey: [queryKey, { page, vendorId }],
        // The query function passes these params to your API layer
        queryFn: () => productApi.getAdminProducts({ page, vendorId }),
        // Keep previous data visible while new data loads for smoother pagination
        keepPreviousData: true,
    });
};

/**
 * Hook to fetch products for a SPECIFIC vendor. Optimized for detail pages.
 * @param {string} vendorId - The ID of the vendor.
 */
export const useAdminVendorProducts = (vendorId) => {
    return useQuery({
        // The query key includes the vendorId so data is cached per vendor
        queryKey: [queryKey, 'vendor', vendorId],
        // Your API function should handle fetching by vendor_id
        queryFn: () => productApi.getAdminProductsForVendor({ vendorId, perPage: 3 }),
        // The query will only run if a vendorId is provided
        enabled: !!vendorId,
    });
};


// Hook for standard CUD (Create, Update, Delete) actions
export const useAdminProductActions = () => {
    const queryClient = useQueryClient();

    // Invalidate ALL product queries to ensure all lists are updated
    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [queryKey] });

    const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
        mutationFn: productApi.deleteAdminProduct,
        onSuccess: invalidateList,
    });

    // Add create/update mutations here later if you need a form

    return { deleteProduct, isDeleting };
};

// Special hook for the file upload mutation
export const useAdminProductUpload = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productApi.uploadAdminProducts, // Expects { vendorId, file }
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            // Replaced alert with a more modern approach (useToast hook)
        },
        onError: (error) => {
            // Error handling should be done in the component with useToast
        },
    });
};