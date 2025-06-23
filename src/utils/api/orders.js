// src/utils/api/orders.js
import api from '../api';

// ======================================================
// --- CUSTOMER-SPECIFIC ORDER ACTIONS ---
// ======================================================

/**
 * Creates an order for a specific product.
 * @param {object} orderData - e.g., { product: productId, quantity: 1 }
 */
export const createOrder = async (orderData) => {
    const { data } = await api.post("/order/", orderData);
    return data;
};

/**
 * Fetches the orders for the currently authenticated customer.
 * (Assumes the backend filters orders by the logged-in user)
 */
export const getCustomerOrders = async () => {
    const { data } = await api.get('/order/list/'); // Same endpoint, backend handles filtering
    return data;
};

// ======================================================
// --- ADMIN-SPECIFIC ORDER ACTIONS ---
// ======================================================

/**
 * Fetches ALL orders for the admin panel.
 */
export const getAdminOrders = async () => {
    const { data } = await api.get('/order/list/');
    return data;
};

/**
 * Gets the details for a single order.
 */
export const getAdminOrderDetails = async (orderId) => {
    const { data } = await api.get(`/admin/order/${orderId}`);
    return data;
};

/**
 * Updates an order's status or other details.
 * @param {object} - e.g., { orderId: 1, payload: { status: 'Confirmed' } }
 */
export const updateAdminOrder = async ({ orderId, payload }) => {
    const { data } = await api.put(`/admin/order/${orderId}`, payload);
    return data;
};

/**
 * Deletes an order as an admin.
 */
export const deleteAdminOrder = async (orderId) => {
    await api.delete(`/admin/order/${orderId}`);
    return orderId;
};