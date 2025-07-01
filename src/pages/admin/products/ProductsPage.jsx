import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminProductsList, useAdminProductActions } from '../../../utils/hooks/useAdminProducts';
import AdminProductBulkUploadModal from '../../../components/admin/AdminProductBulkUploadModal';

const ProductsPage = () => {
    const { data: productsData, isLoading } = useAdminProductsList({});
    const { deleteProduct, isDeleting } = useAdminProductActions();

    const products = productsData?.results || [];

    if (isLoading) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Management (Admin)</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => document.getElementById('admin_bulk_upload_modal').showModal()}
                >
                    Bulk Upload Products
                </button>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Vendor</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={product.images?.[0]?.image || 'https://via.placeholder.com/150'} alt={product.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{product.name}</div>
                                                    <div className="text-sm opacity-50">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.vendor_details?.company_name || 'N/A'}</td>
                                        <td>${product.price.toLocaleString()}</td>
                                        <td>{product.quantity}</td>
                                        <td className="text-right space-x-2">
                                            <Link to={`/admin/products/${product.id}`} className="btn btn-sm btn-outline">Details</Link>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure? This action is permanent.')) {
                                                        deleteProduct(product.id);
                                                    }
                                                }}
                                                className="btn btn-sm btn-outline btn-error"
                                                disabled={isDeleting}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr><td colSpan="5" className="text-center py-4">No products found in the system.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* The modal component sits here, ready to be called */}
            <AdminProductBulkUploadModal modalId="admin_bulk_upload_modal" />
        </div>
    );
};

export default ProductsPage;