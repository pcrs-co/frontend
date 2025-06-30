// src/pages/vendor/ProductsPage.jsx
import React, { useState } from 'react';
import { useVendorProducts } from '../../utils/hooks/useVendorProducts';
import { useToast } from '../../context/ToastContext';
import ProductFormModal from '../../components/vendor/ProductFormModal';

export default function VendorProductsPage() {
    const { 
        products, isLoading, 
        addProduct, isAdding, 
        editProduct, isEditing, 
        removeProduct, isRemoving 
    } = useVendorProducts();
    const { showToast } = useToast();
    
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openAddModal = () => {
        setSelectedProduct(null);
        document.getElementById('product_modal').showModal();
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        document.getElementById('product_modal').showModal();
    };

    const handleSave = (productData) => {
        const action = selectedProduct ? editProduct : addProduct;
        const payload = selectedProduct ? { id: selectedProduct.id, payload: productData } : productData;

        action(payload, {
            onSuccess: () => {
                showToast({ message: `Product ${selectedProduct ? 'updated' : 'added'} successfully!`, type: 'success' });
                document.getElementById('product_modal').close();
            },
            onError: (err) => {
                showToast({ message: `Error: ${err.message}`, type: 'error' });
            }
        });
    };
    
    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            removeProduct(productId, {
                onSuccess: () => showToast({ message: 'Product deleted.', type: 'success' }),
                onError: (err) => showToast({ message: `Error: ${err.message}`, type: 'error' }),
            });
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Products</h1>
                <div className="flex gap-2">
                    <button onClick={openAddModal} className="btn btn-primary">
                        + Add Product
                    </button>
                    {/* You can add a bulk upload button here later */}
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map(p => (
                                    <tr key={p.id} className="hover">
                                        <td className="font-bold">{p.name}</td>
                                        <td>{p.brand}</td>
                                        <td>${p.price}</td>
                                        <td>{p.quantity}</td>
                                        <td className="text-right space-x-2">
                                            <button onClick={() => openEditModal(p)} className="btn btn-sm btn-outline btn-info">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline btn-error" disabled={isRemoving}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {products?.length === 0 && (
                                    <tr><td colSpan="5" className="text-center py-4">You haven't added any products yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ProductFormModal 
                product={selectedProduct} 
                onSave={handleSave}
                isSaving={isAdding || isEditing}
            />
        </div>
    );
}