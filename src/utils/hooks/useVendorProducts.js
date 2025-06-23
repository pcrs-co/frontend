// src/utils/hooks/useVendorProducts.js
import { useState, useEffect } from 'react';
import {
    getVendorProducts,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
    uploadVendorProducts
} from '../api/products'; // Uses the new vendor-specific API functions

export const useVendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getVendorProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch vendor products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (productData) => {
        await createVendorProduct(productData);
        fetchProducts(); // Refetch list after adding
    };

    const editProduct = async (id, payload) => {
        await updateVendorProduct({ id, payload });
        fetchProducts(); // Refetch list after updating
    };

    const removeProduct = async (id) => {
        await deleteVendorProduct(id);
        fetchProducts(); // Refetch list after deleting
    };

    const uploadFile = async (file) => {
        await uploadVendorProducts({ file });
        fetchProducts(); // Refetch list after upload
    };

    return {
        products,
        loading,
        addProduct,
        editProduct,
        removeProduct,
        uploadFile,
        refetch: fetchProducts,
    };
};