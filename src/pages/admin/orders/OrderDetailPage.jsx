import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdminOrderDetails } from '../../../utils/api/orders';

const OrderDetailPage = () => {
    const { orderId } = useParams();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['adminOrders', orderId],
        queryFn: () => getAdminOrderDetails(orderId),
        enabled: !!orderId,
    });

    if (isLoading) return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    if (error) return <div className="p-6 alert alert-error">{error.message}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body space-y-4">
                    <h2 className="card-title">Order Summary</h2>
                    <p><strong>Status:</strong> <span className="badge badge-lg">{order.status}</span></p>
                    <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <div className="divider"></div>
                    <h3 className="font-bold text-lg">Customer Details</h3>
                    <p><strong>Email:</strong> {order.user_email}</p>
                    <div className="divider"></div>
                    <h3 className="font-bold text-lg">Product Details</h3>
                    <p><strong>Product:</strong> {order.product_name}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Price per item:</strong> ${order.product_price}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;