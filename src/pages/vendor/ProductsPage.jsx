import React, { useState } from 'react';
import { useVendorProducts } from '../../utils/hooks/useVendorProducts';
import ProductFormModal from '../../components/vendor/ProductFormModal';
import ProductBulkUploadModal from '../../components/vendor/ProductBulkUploadModal';
import ProductDetailModal from '../../components/products/ProductDetailModal'; // <-- 1. IMPORT

export default function VendorProductsPage() {
    const {
        products, isLoading, addProduct, isAdding,
        editProduct, isEditing, removeProduct, isRemoving
    } = useVendorProducts();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewProductId, setViewProductId] = useState(null); // <-- 2. ADD STATE FOR VIEWING

    const openAddModal = () => {
        setSelectedProduct(null);
        document.getElementById('product_form_modal').showModal();
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        document.getElementById('product_form_modal').showModal();
    };

    const handleSave = (productData) => {
        const action = selectedProduct ? editProduct : addProduct;
        const payload = selectedProduct ? { id: selectedProduct.id, payload: productData } : productData;

        action(payload, {
            onSuccess: () => document.getElementById('product_form_modal').close()
        });
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            removeProduct(productId);
        }
    };

    if (isLoading) return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <div className="flex gap-2">
                    <button onClick={openAddModal} className="btn btn-primary">
                        + Add Product
                    </button>
                    <button className="btn btn-outline" onClick={() => document.getElementById('vendor_bulk_upload_modal').showModal()}>
                        Bulk Upload
                    </button>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map(p => (
                                    <tr key={p.id} className="hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={p.images?.[0]?.image || 'https://via.placeholder.com/150'} alt={p.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{p.name}</div>
                                                    <div className="text-sm opacity-50">{p.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>TSh {p.price ? new Intl.NumberFormat().format(p.price) : 'N/A'}</td>
                                        <td>{p.quantity}</td>
                                        <td className="text-right space-x-2">
                                            {/* 3. ADD VIEW BUTTON */}
                                            <button onClick={() => setViewProductId(p.id)} className="btn btn-sm btn-outline">View</button>
                                            <button onClick={() => openEditModal(p)} className="btn btn-sm btn-outline btn-info">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline btn-error" disabled={isRemoving}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {products?.length === 0 && <tr><td colSpan="4" className="text-center py-4">No products found. Add one or use the bulk upload feature.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ProductFormModal
                formId="product_form_modal"
                product={selectedProduct}
                onSave={handleSave}
                isSaving={isAdding || isEditing}
            />
            <ProductBulkUploadModal modalId="vendor_bulk_upload_modal" />

            {/* 4. RENDER THE MODAL */}
            {viewProductId && (
                <ProductDetailModal
                    productId={viewProductId}
                    onClose={() => setViewProductId(null)}
                />
            )}
        </div>
    );
}