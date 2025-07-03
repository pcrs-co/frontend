// src/utils/api/orders.js
import api from '../api';

export const createOrder = async (orderData) => {
    // --- THIS IS THE FIX ---
    // The URL must match the full path defined in Django's routing: /api/order/orders/
    const { data } = await api.post("/orders/", orderData);
    return data;
};

export const getOrdersList = async (params = {}) => {
    const { data } = await api.get('/orders/', { params });
    return data;
};

// FIX: Update the URL to match a standard DRF ViewSet pattern for retrieve/update
export const updateOrderWithAction = async ({ orderId, action }) => {
    const { data } = await api.patch(`/orders/${orderId}/`, { action });
    return data;
};

// FIX: Update the URL for deletion
export const deleteOrder = async (orderId) => {
    await api.delete(`/orders/${orderId}/`);
    return orderId;
};