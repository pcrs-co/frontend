// src/pages/admin/orders/OrdersPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// --- CHANGE START ---
// FIX: Import the new, unified hooks.
import { useOrdersList, useOrderActions } from '../../../utils/hooks/useOrders';
import { useToast } from '../../../context/ToastContext'; // Import useToast
// --- CHANGE END ---

const OrdersPage = () => {
    const { showToast } = useToast(); // Initialize the toast hook

    // --- CHANGE START ---
    // FIX: Use the single useOrdersList hook. The backend handles filtering by role.
    const { data: ordersResponse, isLoading } = useOrdersList();
    const orders = ordersResponse?.results || ordersResponse || [];

    // FIX: Use the single useOrderActions hook.
    const { updateOrder, isUpdating, removeOrder, isDeleting } = useOrderActions();
    // --- CHANGE END ---

    const handleAction = (orderId, action) => {
        updateOrder({ orderId, action }, {
            onSuccess: () => showToast({ message: `Order #${orderId} has been ${action}ed.`, type: 'success' }),
            onError: (err) => showToast({ message: err.response?.data?.detail || err.message, type: 'error' }),
        });
    };

    const handleDelete = (orderId) => {
        if (window.confirm(`Are you sure you want to permanently delete order #${orderId}?`)) {
            removeOrder(orderId, {
                onSuccess: () => showToast({ message: `Order #${orderId} deleted.`, type: 'success' }),
                onError: (err) => showToast({ message: err.response?.data?.detail || err.message, type: 'error' }),
            });
        }
    };

    if (isLoading) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(order => (
                            <tr key={order.id} className="hover">
                                <td className="font-mono">#{order.id}</td>
                                <td>{order.user?.email || 'N/A'}</td>
                                <td>{order.product?.name || 'N/A'}</td>
                                <td><span className="badge badge-ghost">{order.status}</span></td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* --- CHANGE START --- */}
                                        {/* FIX: Show action buttons only for pending orders */}
                                        {order.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(order.id, 'confirm')}
                                                    className="btn btn-sm btn-success"
                                                    disabled={isUpdating}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleAction(order.id, 'cancel')}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isUpdating}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {/* FIX: Link to a detail page */}
                                        <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-ghost">View</Link>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="btn btn-sm btn-error"
                                            disabled={isDeleting}
                                        >
                                            Delete
                                        </button>
                                        {/* --- CHANGE END --- */}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-4">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;