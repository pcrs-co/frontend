import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';
import {
    getVendorProducts,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
    uploadVendorProductsBulk
} from '../api/products';

const VENDOR_PRODUCTS_QUERY_KEY = 'vendorProducts';

export const useVendorProducts = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: [VENDOR_PRODUCTS_QUERY_KEY] });
    };

    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: [VENDOR_PRODUCTS_QUERY_KEY],
        queryFn: getVendorProducts,
    });

    const { mutate: addProduct, isPending: isAdding } = useMutation({
        mutationFn: createVendorProduct,
        onSuccess: () => {
            invalidate();
            showToast({ message: 'Product added successfully!', type: 'success' });
        },
        onError: (err) => showToast({ message: `Error: ${err.message}`, type: 'error' }),
    });

    const { mutate: editProduct, isPending: isEditing } = useMutation({
        mutationFn: updateVendorProduct,
        onSuccess: (data) => {
            invalidate();
            queryClient.setQueryData(['adminProductDetails', data.id], data); // Also update detail cache
            showToast({ message: 'Product updated successfully!', type: 'success' });
        },
        onError: (err) => showToast({ message: `Error: ${err.message}`, type: 'error' }),
    });

    const { mutate: removeProduct, isPending: isRemoving } = useMutation({
        mutationFn: deleteVendorProduct,
        onSuccess: () => {
            invalidate();
            showToast({ message: 'Product deleted successfully!', type: 'success' });
        },
        onError: (err) => showToast({ message: `Error: ${err.message}`, type: 'error' }),
    });

    const { mutate: uploadFile, isPending: isUploading } = useMutation({
        mutationFn: uploadVendorProductsBulk,
        onSuccess: (data) => {
            invalidate();
            showToast({ message: data.message || 'Products uploaded!', type: 'success' });
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

    return {
        products, isLoading, isError, error,
        addProduct, isAdding,
        editProduct, isEditing,
        removeProduct, isRemoving,
        uploadFile, isUploading,
    };
};