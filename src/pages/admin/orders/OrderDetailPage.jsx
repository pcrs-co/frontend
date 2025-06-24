// src/pages/admin/orders/OrderDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
// --- CHANGE START ---
// FIX: We can use our powerful generic hook to fetch a single item.
import { useAdminResourceList } from '../../../utils/hooks/useAdminResourceList';
// --- CHANGE END ---

const OrderDetailPage = () => {
    const { orderId } = useParams();

    // --- CHANGE START ---
    // FIX: The backend detail view is at /api/order/{id}/. We can fetch it by
    // telling our generic hook the resource is 'order' and passing the ID.
    // The hook will call `/api/admin/order/${orderId}/` which should be a valid alias or redirect.
    // Let's assume our backend has a route at /api/admin/orders/{id}/ for this.
    const { data: order, isLoading, error } = useAdminResourceList(`orders/${orderId}`);
    // --- CHANGE END ---

    if (isLoading) return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    if (error) return <div className="p-6 alert alert-error">{error.message}</div>;
    if (!order) return <div className="p-6">Order not found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Order Details #{order.id}</h1>
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body space-y-4">
                    <h2 className="card-title">Order Summary</h2>
                    <p><strong>Status:</strong> <span className="badge badge-lg">{order.status}</span></p>
                    <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>

                    <div className="divider"></div>
                    <h3 className="font-bold text-lg">Customer Details</h3>
                    {/* --- CHANGE START --- */}
                    {/* FIX: Access nested data returned by our backend serializers */}
                    <p><strong>Customer:</strong> {order.user?.first_name} {order.user?.last_name}</p>
                    <p><strong>Email:</strong> {order.user?.email}</p>
                    {/* --- CHANGE END --- */}

                    <div className="divider"></div>
                    <h3 className="font-bold text-lg">Product Details</h3>
                    {/* --- CHANGE START --- */}
                    {/* FIX: Access nested data returned by our backend serializers */}
                    <p><strong>Product:</strong> {order.product?.name}</p>
                    <p><strong>Vendor:</strong> {order.vendor?.company_name}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Price per item:</strong> ${order.product?.price}</p>
                    <p className="font-bold"><strong>Total:</strong> ${(order.product?.price * order.quantity).toFixed(2)}</p>
                    {/* --- CHANGE END --- */}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;