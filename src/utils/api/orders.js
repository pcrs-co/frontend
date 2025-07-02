// src/utils/api/orders.js
import api from '../api';

export const createOrder = async (orderData) => {
    // --- THIS IS THE FIX ---
    // The URL must match the full path defined in Django's routing.
    const { data } = await api.post("/order/orders/", orderData);
    return data;
};

/**
 * Fetches a list of orders from the correct, full URL.
 * @param {object} params - Optional query parameters.
 */
export const getOrdersList = async (params = {}) => {
    const { data } = await api.get('/order/orders/', { params });
    return data;
};

export const updateOrderWithAction = async ({ orderId, action }) => {
    // FIX: The URL now uses 'pk' and the standard endpoint
    const { data } = await api.patch(`/order/orders/${orderId}/`, { action });
    return data;
};

export const deleteOrder = async (orderId) => {
    await api.delete(`/order/orders/${orderId}/`);
    return orderId;
};