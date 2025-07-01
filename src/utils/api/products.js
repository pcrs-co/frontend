// src/utils/api/products.js
import api from '../api';

// ======================================================
// --- VENDOR-SPECIFIC PRODUCT ACTIONS ---
// ======================================================

/**
 * Fetches the products for the currently authenticated vendor.
 */
export const getVendorProducts = async () => {
    const { data } = await api.get('/vendor/products/');
    return data.results; // Assumes your endpoint is paginated
};

/**
 * Creates a single product for the authenticated vendor.
 * @param {FormData} productData - The product data, including any images.
 */
export const createVendorProduct = async (productData) => {
    const { data } = await api.post('/vendor/products/', productData);
    return data;
};

/**
 * Updates a product owned by the authenticated vendor.
 * @param {object} params
 * @param {string|number} params.id - The ID of the product to update.
 * @param {FormData} params.payload - The updated product data.
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
 * Uploads a spreadsheet and a zip file of images for bulk product creation.
 * @param {object} data - An object containing the files.
 * @param {File} data.spreadsheetFile - The .csv or .xlsx file.
 * @param {File|null} data.imageZipFile - The optional .zip file of images.
 */
export const uploadVendorProductsBulk = async ({ spreadsheetFile, imageZipFile }) => {
    const formData = new FormData();
    formData.append('file', spreadsheetFile);
    if (imageZipFile) formData.append('image_zip', imageZipFile);
    const { data: responseData } = await api.post('/vendor/products/upload/', formData);
    return responseData;
};


// ======================================================
// --- ADMIN-SPECIFIC PRODUCT ACTIONS ---
// ======================================================

/**
 * Fetches ALL products from any vendor for the admin panel.
 * @param {object} params - Optional query params like page.
 */
export const getAdminProducts = async (params = {}) => {
    const { data } = await api.get('/admin/products/', { params });
    return data; // Return the full paginated response
};

/**
 * Fetches the details for a single product.
 * @param {string|number} id - The product ID.
 */
export const getAdminProductDetails = async (id) => {
    const { data } = await api.get(`/admin/products/${id}/`);
    return data;
};

/**
 * Updates a single product as an admin.
 * @param {object} params
 * @param {string|number} params.id - The ID of the product to update.
 * @param {FormData} params.payload - The updated product data.
 */
export const updateAdminProduct = async ({ id, payload }) => {
    const { data } = await api.put(`/admin/products/${id}/`, payload);
    return data;
};

/**
 * Deletes any product as an admin.
 */
export const deleteAdminProduct = async (id) => {
    await api.delete(`/admin/products/${id}/`);
    return id;
};

/**
 * Uploads a spreadsheet and zip file for a SPECIFIC vendor.
 * @param {object} data
 * @param {string} data.vendorId - The ID of the vendor.
 * @param {File} data.spreadsheetFile - The .csv or .xlsx file.
 * @param {File|null} data.imageZipFile - The optional .zip file of images.
 */
export const uploadAdminProductsBulk = async ({ vendorId, spreadsheetFile, imageZipFile }) => {
    const formData = new FormData();
    // --- FIX: Add vendor_id to the FormData ---
    formData.append('vendor_id', vendorId);
    formData.append('file', spreadsheetFile);
    if (imageZipFile) {
        formData.append('image_zip', imageZipFile);
    }
    // The URL is now simpler
    const { data } = await api.post(`/admin/products/upload/`, formData);
    return data;
};