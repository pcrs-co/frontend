// src/pages/customer/components/OrdersHistory.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrdersList } from '../../utils/api/orders';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
    const statusClasses = { pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-error' };
    return <div className={`badge ${statusClasses[status] || 'badge-ghost'} capitalize`}>{status}</div>;
};

export default function OrdersHistory() {
    const { data, isLoading } = useQuery({
        queryKey: ['userAllOrders'], // A key for the full list
        queryFn: getOrdersList,
    });

    if (isLoading) return <div className="flex justify-center p-4"><span className="loading loading-dots loading-md"></span></div>;

    const orders = data?.results || [];

    if (orders.length === 0) {
        return <div className="text-center py-8 text-base-content/70">You haven't placed any orders yet.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="hover">
                            <td>{order.product_name || 'N/A'}</td>
                            <td>{order.quantity}</td>
                            <td><StatusBadge status={order.status} /></td>
                            <td>{format(new Date(order.created_at), 'dd MMM, yyyy')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}