// src/utils/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// --- CHANGE START ---
// FIX: Import the new, streamlined API functions from our updated orders.js file.
import {
    createOrder,
    getOrdersList,
    updateOrderWithAction,
    deleteOrder,
} from '../api/orders';
// --- CHANGE END ---

// A single, consistent query key for all order lists.
const ORDERS_QUERY_KEY = ['orders'];

// ======================================================
// --- HOOK FOR CREATING AN ORDER (FOR CUSTOMERS) ---
// ======================================================

/**
 * Hook for a customer to create a new order.
 */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            // After creating an order, refresh all order lists.
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
        // You should add onError handling here to show a toast message on failure.
    });
};

// ======================================================
// --- HOOKS FOR VIEWING & MANAGING ORDERS (FOR ALL ROLES) ---
// ======================================================

/**
 * Hook to fetch the list of orders.
 * The backend automatically filters by role (customer, vendor, or admin).
 * This one hook replaces useCustomerOrdersList and useAdminOrdersList.
 */
export const useOrdersList = () => {
    // --- CHANGE START ---
    return useQuery({
        queryKey: ORDERS_QUERY_KEY,
        queryFn: getOrdersList,
    });
    // --- CHANGE END ---
};

/**
 * Hook for performing actions (confirm, cancel, delete) on orders.
 * This one hook can be used by both Admins and Vendors on their dashboards.
 */
export const useOrderActions = () => {
    // --- CHANGE START ---
    const queryClient = useQueryClient();
    const invalidateOrderList = () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });

    // FIX: Mutation for updating an order via an action.
    const { mutate: updateOrder, isPending: isUpdating } = useMutation({
        mutationFn: updateOrderWithAction, // Expects an object like { orderId: 1, action: 'confirm' }
        onSuccess: invalidateOrderList,
    });

    // FIX: Mutation for deleting an order.
    const { mutate: removeOrder, isPending: isDeleting } = useMutation({
        mutationFn: deleteOrder, // Expects just the orderId
        onSuccess: invalidateOrderList,
    });

    return { updateOrder, isUpdating, removeOrder, isDeleting };
    // --- CHANGE END ---
};