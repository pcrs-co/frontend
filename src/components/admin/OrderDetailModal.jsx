// src/components/admin/OrderDetailsModal.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrderDetail } from '../../utils/api/orders'; // Use the list API to fetch single order by ID or assume detail API

const OrderDetailsModal = ({ orderId, isOpen, onClose }) => {
    // --- Data Fetching for a single order ---
    // We use useQuery to fetch details for a specific order.
    // Assuming the getOrdersList can fetch a specific order if given its ID,
    // or you might have a getOrderDetail function in utils/api/orders.js.
    // For now, we'll refine the generic approach.
    const { data: order, isLoading, error } = useQuery({
        queryKey: ['orderDetails', orderId],
        queryFn: async () => {
            // Fetch directly from the detail endpoint: /api/order/orders/{orderId}/
            const response = await getOrderDetail(orderId);
            return response; // Assuming it returns the single order object directly
        },
        enabled: !!orderId && isOpen, // Only fetch if we have an ID and the modal is open
        staleTime: Infinity, // Order details are unlikely to change during a session
    });

    if (!isOpen) return null; // Don't render anything if the modal is not open

    if (isLoading) {
        return (
            <dialog className="modal modal-open bg-black/40">
                <div className="modal-box w-11/12 max-w-3xl flex justify-center items-center h-64">
                    <span className="loading loading-lg"></span>
                </div>
            </dialog>
        );
    }

    if (error) {
        return (
            <dialog className="modal modal-open bg-black/40">
                <div className="modal-box w-11/12 max-w-3xl">
                    <h3 className="font-bold text-lg text-error">Error loading order!</h3>
                    <p className="py-4">Failed to fetch order details: {error.message}</p>
                    <div className="modal-action">
                        <button className="btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            </dialog>
        );
    }

    if (!order) {
        return (
            <dialog className="modal modal-open bg-black/40">
                <div className="modal-box w-11/12 max-w-3xl">
                    <h3 className="font-bold text-lg">Order not found.</h3>
                    <div className="modal-action">
                        <button className="btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            </dialog>
        );
    }

    // --- Helper for formatting price ---
    const formatPrice = (price) => {
        return price ? `TSh ${new Intl.NumberFormat('en-US').format(price)}` : 'N/A';
    };

    return (
        <dialog id="order_details_modal" className="modal modal-open bg-black/40">
            <div className="modal-box w-11/12 max-w-4xl">
                <form method="dialog">
                    {/* Button to close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                </form>
                <h3 className="font-bold text-2xl mb-4">Order Details #{order.id}</h3>
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-sm p-4">
                        <h4 className="font-bold text-lg mb-2">Order Summary</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p><strong>Status:</strong> <span className="badge badge-lg">{order.status}</span></p>
                            <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm p-4">
                        <h4 className="font-bold text-lg mb-2">Customer Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p><strong>Name:</strong> {order.user?.first_name} {order.user?.last_name || 'N/A'}</p>
                            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {order.user?.phone_number || 'N/A'}</p>
                            <p><strong>Location:</strong> {order.user?.district || 'N/A'}, {order.user?.region || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm p-4">
                        <h4 className="font-bold text-lg mb-2">Product Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p><strong>Product:</strong> {order.product?.name || 'N/A'}</p>
                            <p><strong>Vendor:</strong> {order.vendor?.company_name || 'N/A'}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Price per item:</strong> {formatPrice(order.product?.price)}</p>
                            <p className="font-bold"><strong>Total Order Value:</strong> {formatPrice(order.product?.price * order.quantity)}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Click backdrop to close */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default OrderDetailsModal;