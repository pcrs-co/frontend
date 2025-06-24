// src/utils/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as orderApi from '../api/orders';

// ======================================================
// --- HOOKS FOR CUSTOMERS ---
// ======================================================

/**
 * Hook for a customer to create a new order.
 * Typically used on a product detail page.
 */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orderApi.createOrder,
        onSuccess: () => {
            alert('Order placed successfully! The vendor has been notified.');
            // Optionally, invalidate customer's own order list
            queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
        },
        onError: (error) => {
            alert(`Failed to place order: ${error.response?.data?.detail || error.message}`);
        }
    });
};

/**
 * Hook to fetch the authenticated customer's order history.
 */
export const useCustomerOrdersList = () => {
    return useQuery({
        queryKey: ['customerOrders'],
        queryFn: orderApi.getCustomerOrders,
    });
};


// ======================================================
// --- HOOKS FOR ADMINS ---
// ======================================================
const adminOrdersKey = 'adminOrders';

/**
 * Hook for admins to get the list of ALL orders.
 */
export const useAdminOrdersList = () => {
    return useQuery({
        queryKey: [adminOrdersKey],
        queryFn: orderApi.getAdminOrders,
    });
};

/**
 * Hook for admins to perform actions (update, delete) on orders.
 */
export const useAdminOrderActions = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [adminOrdersKey] });

    // Mutation for deleting an order
    const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
        mutationFn: orderApi.deleteAdminOrder,
        onSuccess: invalidate,
    });

    // Mutation for updating an order
    const { mutate: updateOrder, isPending: isUpdating } = useMutation({
        mutationFn: orderApi.updateAdminOrder,
        onSuccess: invalidate,
    });

    return { deleteOrder, isDeleting, updateOrder, isUpdating };
};

/**
 * Hook to fetch orders for a specific customer, for use in the admin panel.
 * @param {string} customerId - The ID of the customer.
 */
export const useAdminCustomerOrders = (customerId) => {
    return useQuery({
        // A unique query key that includes the customerId
        queryKey: ['adminOrders', 'customer', customerId],
        // Your API function needs to support filtering by user_id
        queryFn: () => orderApi.getAdminOrders({ customerId, perPage: 3 }),
        enabled: !!customerId, // Only run if customerId is present
    });
};