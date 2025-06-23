// src/utils/api/products.js
import api from '../api';

// ======================================================
// --- VENDOR-SPECIFIC PRODUCT ACTIONS ---
// (Endpoints starting with /vendor/products/)
// ======================================================

/**
 * Fetches the products for the currently authenticated vendor.
 */
export const getVendorProducts = async () => {
    const { data } = await api.get('/vendor/products/');
    return data.results; // Assumes pagination
};

/**
 * Creates a new product for the authenticated vendor.
 */
export const createVendorProduct = async (productData) => {
    // If sending files, ensure productData is FormData
    const { data } = await api.post('/vendor/products/', productData);
    return data;
};

/**
 * Updates a product owned by the authenticated vendor.
 */
export const updateVendorProduct = async ({ id, payload }) => {
    const { data } = await api.put(`/vendor/products/${id}/`, payload);
    return data;
};

/**
 * Deletes a product owned by the authenticated vendor.
 */
export const deleteVendorProduct = async (id) => {
    await api.delete(`/vendor/products/${id}/`);
    return id; // Return id for optimistic updates
};

/**
 * Uploads a file of products for the authenticated vendor.
 * NOTE: Your backend has a {vendor_id} in the URL, but for a vendor-specific
 * endpoint, the backend should ideally get the vendor from the authenticated user.
 * This function assumes the backend can get the vendor from the token.
 */
export const uploadVendorProducts = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post(
        `/vendor/products/upload/`, // Simplified URL
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
};

// ======================================================
// --- ADMIN-SPECIFIC PRODUCT ACTIONS ---
// (Endpoints starting with /admin/products/)
// ======================================================

/**
 * Fetches ALL products from any vendor for the admin panel.
 */
export const getAdminProducts = async () => {
    const { data } = await api.get('/admin/products/');
    return data.results; // Assumes pagination
};

/**

 * Deletes any product as an admin.
 */
export const deleteAdminProduct = async (id) => {
    await api.delete(`/admin/products/${id}/`);
    return id;
};

/**
 * Uploads a file of products for a SPECIFIC vendor, identified by ID.
 */
export const uploadAdminProducts = async ({ vendorId, file }) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post(
        `/admin/products/upload/${vendorId}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
};

// Note: Admin create/update functions for products can be added here if needed,
// following the pattern of `createAdminProduct` from the previous response.