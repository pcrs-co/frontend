import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';
import * as productApi from '../api/products';

// A consistent query key for all admin-related product data
const ADMIN_PRODUCTS_QUERY_KEY = 'adminProducts';

/**
 * Hook to fetch a paginated list of ALL products for the admin panel.
 * Can be filtered by passing parameters.
 * @param {object} params - Optional query parameters like { page: 1, vendor_id: 'some-uuid' }.
 */
export const useAdminProductsList = (params = {}) => {
    return useQuery({
        // The query key is dynamic, including params to ensure uniqueness for different filters
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY, 'list', params],
        queryFn: () => productApi.getAdminProducts(params),
        keepPreviousData: true, // For smoother pagination
    });
};

/**
 * Hook to fetch details for a single product. Used on the admin detail page.
 * @param {string|number} productId - The ID of the product.
 */
export const useAdminProductDetails = (productId) => {
    return useQuery({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY, 'detail', productId],
        queryFn: () => productApi.getAdminProductDetails(productId),
        enabled: !!productId, // Only run the query if a productId is provided
    });
};

/**
 * Hook to fetch a small list of products for a SPECIFIC vendor.
 * This is optimized for display on a vendor's detail page in the admin panel.
 * @param {string} vendorId - The ID of the vendor.
 */
export const useAdminVendorProducts = (vendorId) => {
    return useQuery({
        // The query key includes the vendorId so data is cached per vendor
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY, 'list', { vendorId, perPage: 3 }],
        // Call the same list API but with filtering parameters
        queryFn: () => productApi.getAdminProducts({ vendor_id: vendorId, page_size: 3 }),
        // The query will only run if a vendorId is provided
        enabled: !!vendorId,
    });
};

/**
 * A comprehensive hook providing all necessary actions (mutations) for an admin to manage products.
 * This includes single product CUD and bulk uploads.
 */
export const useAdminProductActions = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // A generic invalidation function to refetch ALL product lists and details
    const invalidateProducts = () => {
        queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    };

    // Mutation for deleting a product
    const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
        mutationFn: productApi.deleteAdminProduct,
        onSuccess: () => {
            invalidateProducts();
            showToast({ message: 'Product deleted successfully.', type: 'success' });
        },
        onError: (err) => {
            showToast({ message: `Deletion failed: ${err.response?.data?.detail || err.message}`, type: 'error' });
        },
    });

    // Mutation for the bulk upload (spreadsheet + zip)
    const { mutate: uploadBulk, isPending: isUploading } = useMutation({
        mutationFn: productApi.uploadAdminProductsBulk,
        onSuccess: (data) => {
            invalidateProducts();
            showToast({ message: data.message || 'Products uploaded successfully!', type: 'success' });
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.detail ||
                Object.values(error.response?.data || {})?.[0] ||
                'Upload failed.';
            showToast({ message: errorMessage, type: 'error' });
        },
    });

    // Mutation for updating a single product (used in the detail page)
    const { mutate: updateProduct, isPending: isUpdating } = useMutation({
        mutationFn: productApi.updateAdminProduct,
        onSuccess: (updatedData) => {
            // Invalidate all lists
            invalidateProducts();
            // Also, directly update the cache for the specific product detail page for a faster UI response
            queryClient.setQueryData([ADMIN_PRODUCTS_QUERY_KEY, 'detail', updatedData.id], updatedData);
            showToast({ message: 'Product updated successfully!', type: 'success' });
        },
        onError: (err) => {
            showToast({ message: `Update failed: ${err.response?.data?.detail || err.message}`, type: 'error' });
        }
    });

    // You could add a `createProduct` mutation here if you create a dedicated admin form for it.

    return {
        deleteProduct,
        isDeleting,
        uploadBulk,
        isUploading,
        updateProduct,
        isUpdating,
    };
};