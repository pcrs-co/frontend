// src/pages/vendor/OrdersPage.jsx
import React from 'react';
import { useOrdersList, useOrderActions } from '../../utils/hooks/useOrders';
import { useToast } from '../../context/ToastContext';

export default function VendorOrdersPage() {
    // The useOrdersList hook automatically filters orders for the authenticated vendor on the backend
    const { data: ordersResponse, isLoading } = useOrdersList();
    const { updateOrder, isUpdating } = useOrderActions();
    const { showToast } = useToast();

    const allOrders = ordersResponse?.results || ordersResponse || [];

    const handleConfirm = (orderId) => {
        updateOrder({ orderId, action: 'confirm' }, {
            onSuccess: () => showToast({ message: `Order #${orderId} confirmed!`, type: 'success' }),
            onError: (err) => showToast({ message: `Error: ${err.message}`, type: 'error' }),
        });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Customer Orders</h1>
            
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders.map(order => (
                                    <tr key={order.id} className="hover">
                                        <td className="font-mono">#{order.id}</td>
                                        <td>{order.user?.email || 'N/A'}</td>
                                        <td>{order.product?.name || 'N/A'}</td>
                                        <td>{order.quantity}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${
                                                order.status === 'pending' ? 'badge-warning' :
                                                order.status === 'confirmed' ? 'badge-success' : 'badge-error'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            {order.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleConfirm(order.id)}
                                                    className="btn btn-sm btn-success"
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : 'Confirm'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {allOrders.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-4">No orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}