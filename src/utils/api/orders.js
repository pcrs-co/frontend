// src/utils/api/orders.js
import api from '../api';

// ======================================================
// --- UNIFIED ORDER ACTIONS ---
// ======================================================

/**
 * Creates a new order.
 * This correctly points to our new /api/order/create/ endpoint.
 * @param {object} orderData - e.g., { product: 1, quantity: 2 }
 */
export const createOrder = async (orderData) => {
    const { data } = await api.post("/order/create/", orderData);
    return data;
};

/**
 * Fetches a list of orders.
 * This single function replaces both getCustomerOrders and getAdminOrders.
 * The backend automatically filters the results based on the user's role.
 * @param {object} params - Optional query parameters for filtering/pagination.
 */
export const getOrdersList = async (params = {}) => {
    // --- CHANGE START ---
    // FIX: Points to the single, unified /api/order/list/ endpoint.
    const { data } = await api.get('/order/list/', { params });
    // --- CHANGE END ---
    return data;
};

/**
 * Updates an order by sending a specific action.
 * This replaces the old updateAdminOrder function.
 * @param {object} - An object containing the orderId and the action string.
 *                   e.g., { orderId: 1, action: 'confirm' }
 */
export const updateOrderWithAction = async ({ orderId, action }) => {
    // --- CHANGE START ---
    // FIX: The URL now points to the single, unified OrderDetailView.
    // FIX: The payload is now a simple object containing the 'action'. We use PATCH as we are only changing one aspect.
    const { data } = await api.patch(`/order/${orderId}/`, { action });
    // --- CHANGE END ---
    return data;
};

/**
 * Deletes an order from the system.
 * This replaces the old deleteAdminOrder function.
 * @param {string|number} orderId - The ID of the order to delete.
 */
export const deleteOrder = async (orderId) => {
    // --- CHANGE START ---
    // FIX: The URL now points to the single, unified OrderDetailView.
    await api.delete(`/order/${orderId}/`);
    // --- CHANGE END ---
    return orderId;
};