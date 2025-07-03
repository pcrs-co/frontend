// src/pages/admin/orders/OrdersPage.jsx

import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // No longer need Link for details page
import { useOrdersList, useOrderActions } from '../../../utils/hooks/useOrders';
import { useToast } from '../../../context/ToastContext';
import OrderDetailsModal from '../../../components/admin/OrderDetailModal'; // <-- IMPORT THE NEW MODAL

const OrdersPage = () => {
    const { showToast } = useToast();

    const { data: ordersResponse, isLoading } = useOrdersList();
    const orders = ordersResponse?.results || ordersResponse || [];

    const { updateOrder, isUpdating, removeOrder, isDeleting } = useOrderActions();

    // --- State to control the modal ---
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openOrderDetailsModal = (id) => {
        setSelectedOrderId(id);
        setIsModalOpen(true);
    };

    const closeOrderDetailsModal = () => {
        setSelectedOrderId(null);
        setIsModalOpen(false);
    };

    const handleAction = (orderId, action) => {
        updateOrder({ orderId, action }, {
            onSuccess: () => showToast({ message: `Order #${orderId} has been ${action}ed.`, type: 'success' }),
            onError: (err) => showToast({ message: err.response?.data?.detail || err.message, type: 'error' }),
        });
    };

    const handleDelete = (orderId) => {
        if (window.confirm(`Are you sure you want to permanently delete order #${orderId}? This action cannot be undone.`)) {
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
                                <td><span className={`badge ${order.status === 'pending' ? 'badge-warning' : order.status === 'confirmed' ? 'badge-success' : 'badge-error'} badge-ghost`}>{order.status}</span></td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
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
                                        {/* --- CHANGE: Call modal open function --- */}
                                        <button
                                            onClick={() => openOrderDetailsModal(order.id)}
                                            className="btn btn-sm btn-ghost"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="btn btn-sm btn-error"
                                            disabled={isDeleting}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-4">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* --- Render the modal --- */}
            <OrderDetailsModal
                orderId={selectedOrderId}
                isOpen={isModalOpen}
                onClose={closeOrderDetailsModal}
            />
        </div>
    );
};

export default OrdersPage;