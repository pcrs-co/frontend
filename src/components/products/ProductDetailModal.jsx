// src/components/products/ProductDetailModal.jsx

import React, { useState } from 'react';
import { useAuth } from '../../utils/hooks/useAuth';
import { useProductInteraction } from '../../utils/hooks/usePublicProducts';
import { useToast } from '../../context/ToastContext';
import OrderSuccessModal from './OrderSuccessModal'; // <-- IMPORT THE NEW MODAL

// A small helper component for spec details
const SpecItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="py-1 px-2 even:bg-base-200 rounded">
            <span className="font-semibold text-sm">{label}: </span>
            <span className="text-sm text-base-content/80">{value}</span>
        </div>
    );
};

// A helper for the vendor-specific order stats
const VendorOrderStats = ({ summary }) => (
    <div className="stats stats-vertical lg:stats-horizontal shadow mt-4 bg-base-200">
        <div className="stat">
            <div className="stat-title">Pending Orders</div>
            <div className="stat-value">{summary.pending_orders}</div>
            <div className="stat-desc">Awaiting your confirmation</div>
        </div>
        <div className="stat">
            <div className="stat-title">Confirmed Orders</div>
            <div className="stat-value">{summary.confirmed_orders}</div>
            <div className="stat-desc">Stock has been deducted</div>
        </div>
    </div>
);

export default function ProductDetailModal({ productId, onClose }) {
    const { user, userRole, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const { product, isLoading, isError, placeOrder, isOrdering } = useProductInteraction(productId);

    // --- State to hold the data of a successfully placed order ---
    const [successfulOrder, setSuccessfulOrder] = useState(null);

    if (isLoading) {
        return (
            <dialog className="modal modal-open bg-black/30">
                <div className="modal-box w-11/12 max-w-3xl flex justify-center items-center h-64">
                    <span className="loading loading-lg"></span>
                </div>
            </dialog>
        );
    }

    if (isError || !product) {
        onClose();
        showToast({ message: "Could not load product details.", type: "error" });
        return null;
    }

    const handleOrder = () => {
        if (!isAuthenticated) {
            showToast({ message: "Please log in to place an order.", type: "info" });
            return;
        }
        placeOrder({ product: product.id, quantity: 1 }, {
            onSuccess: (orderData) => {
                // On success, we set the successful order data, which will trigger the success modal
                setSuccessfulOrder(orderData);
            },
            onError: (err) => {
                showToast({ message: `Order failed: ${err.response?.data?.detail || err.message}`, type: "error" });
            }
        });
    };

    // Check if the current user is the vendor who owns this product
    const isOwner = userRole === 'vendor' && product?.vendor?.user?.id === user?.id;

    return (
        <>
            <dialog id="product_detail_modal" className="modal modal-open bg-black/30" onClick={onClose}>
                <div className="modal-box w-11/12 max-w-4xl" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Carousel */}
                        <div>
                            <div className="carousel w-full rounded-box bg-base-200 h-96">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((img, index) => (
                                        <div id={`slide${index}`} className="carousel-item relative w-full" key={img.id}>
                                            <img src={img.image} className="w-full h-full object-contain p-2" alt={img.alt_text} />
                                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                                <a href={`#slide${(index - 1 + product.images.length) % product.images.length}`} className="btn btn-circle">❮</a>
                                                <a href={`#slide${(index + 1) % product.images.length}`} className="btn btn-circle">❯</a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-base-300 rounded-box text-base-content/50">No Image Available</div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <p className="text-sm font-semibold text-accent">Sold by: {product.vendor.company_name}</p>
                            <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
                            <p className="text-lg font-light text-base-content/70">{product.brand}</p>
                            <p className="text-3xl font-bold text-primary my-4">{`TSh ${new Intl.NumberFormat().format(product.price)}`}</p>

                            <div className="space-y-1 mt-4 p-2 border-t">
                                <h3 className="font-bold mb-2">Key Specifications</h3>
                                <SpecItem label="Processor" value={product.processor?.data_received} />
                                <SpecItem label="Graphics" value={product.graphic?.data_received} />
                                <SpecItem label="Memory" value={product.memory?.data_received} />
                                <SpecItem label="Storage" value={product.storage?.data_received} />
                                <SpecItem label="Display" value={product.display?.data_received} />
                            </div>

                            {/* Conditional UI: Show order stats to owner, order button to customer */}
                            {isOwner && product.vendor_order_summary && (
                                <VendorOrderStats summary={product.vendor_order_summary} />
                            )}

                            {userRole !== 'vendor' && (
                                <button className="btn btn-primary w-full mt-6" onClick={handleOrder} disabled={isOrdering}>
                                    {isOrdering && <span className="loading loading-spinner"></span>}
                                    Request to Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </dialog>

            {/* --- Render the success modal only when an order is successful --- */}
            {successfulOrder && (
                <OrderSuccessModal
                    order={successfulOrder}
                    onClose={() => {
                        setSuccessfulOrder(null); // Hide this modal
                        onClose(); // Also close the parent detail modal
                    }}
                />
            )}
        </>
    );
}