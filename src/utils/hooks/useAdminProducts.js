// src/utils/hooks/useAdminProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productApi from '../api/products';

const queryKey = 'adminProducts';

// Hook to fetch the list of all products
export const useAdminProductsList = () => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: productApi.getAdminProducts,
    });
};

// Hook for standard CUD (Create, Update, Delete) actions
export const useAdminProductActions = () => {
    const queryClient = useQueryClient();

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
            alert('Products uploaded successfully!');
        },
        onError: (error) => {
            alert(`Upload failed: ${error.response?.data?.error || error.message}`);
        },
    });
};