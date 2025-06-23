// src/utils/hooks/useVendorProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getVendorProducts,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
    uploadVendorProducts
} from '../api/products';

const VENDOR_PRODUCTS_QUERY_KEY = 'vendorProducts';

export const useVendorProducts = () => {
    const queryClient = useQueryClient();

    // A function to invalidate the cache and force a refetch
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: [VENDOR_PRODUCTS_QUERY_KEY] });
    };

    // Fetching data with useQuery
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: [VENDOR_PRODUCTS_QUERY_KEY],
        queryFn: getVendorProducts,
    });

    // Mutations for CUD and upload actions
    const { mutate: addProduct, isPending: isAdding } = useMutation({
        mutationFn: createVendorProduct,
        onSuccess: invalidate,
    });

    const { mutate: editProduct, isPending: isEditing } = useMutation({
        mutationFn: ({ id, payload }) => updateVendorProduct({ id, payload }),
        onSuccess: invalidate,
    });

    const { mutate: removeProduct, isPending: isRemoving } = useMutation({
        mutationFn: deleteVendorProduct,
        onSuccess: invalidate,
    });

    const { mutate: uploadFile, isPending: isUploading } = useMutation({
        mutationFn: ({ file }) => uploadVendorProducts({ file }),
        onSuccess: invalidate,
    });

    return {
        products,
        isLoading,
        isError,
        error,
        addProduct, isAdding,
        editProduct, isEditing,
        removeProduct, isRemoving,
        uploadFile, isUploading,
    };
};