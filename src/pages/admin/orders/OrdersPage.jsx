// src/pages/admin/orders/OrdersPage.jsx
import React from 'react';
import { useAdminOrdersList, useAdminOrderActions } from '../../../utils/hooks/useOrders';

const OrdersPage = () => {
    const { data: orders, isLoading } = useAdminOrdersList();
    const { deleteOrder, isDeleting } = useAdminOrderActions();

    if (isLoading) {
        return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">All Orders</h1>
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
                        {orders?.map(order => (
                            <tr key={order.id} className="hover">
                                <td>#{order.id}</td>
                                <td>{order.user_email}</td>
                                <td>{order.product_name}</td>
                                <td><span className="badge badge-ghost">{order.status}</span></td>
                                <td className="text-right">
                                    <button
                                        onClick={() => deleteOrder(order.id)}
                                        className="btn btn-sm btn-error"
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;