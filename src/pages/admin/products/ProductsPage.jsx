// src/pages/admin/products/ProductsPage.jsx
import React, { useState } from 'react';
import { useAdminProductsList, useAdminProductActions, useAdminProductUpload } from '../../../utils/hooks/useAdminProducts';
import { useVendors } from '../../../utils/hooks/useVendors'; // We need the vendor list for the dropdown

const ProductsPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState('');

    // Fetching data
    const { data: products, isLoading } = useAdminProductsList();
    const { vendors, loading: isLoadingVendors } = useVendors(); // Your existing hook is fine here!

    // Actions
    const { deleteProduct, isDeleting } = useAdminProductActions();
    const { mutate: uploadProducts, isPending: isUploading } = useAdminProductUpload();

    const handleUpload = () => {
        if (!selectedFile || !selectedVendor) {
            alert('Please select a vendor and a file.');
            return;
        }
        uploadProducts({ vendorId: selectedVendor, file: selectedFile });
        document.getElementById('upload_modal').close(); // Close modal on submit
    };

    if (isLoading || isLoadingVendors) {
        return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">All Products</h1>
                <button className="btn btn-primary" onClick={() => document.getElementById('upload_modal').showModal()}>
                    Upload Products
                </button>
            </div>

            {/* Table to display products */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* Table Head */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Vendor</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map(product => (
                            <tr key={product.id} className="hover">
                                <td>{product.name}</td>
                                <td>{product.vendor_name}</td>
                                <td>${product.price}</td>
                                <td>{product.quantity}</td>
                                <td className="text-right">
                                    <button
                                        onClick={() => deleteProduct(product.id)}
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

            {/* Upload Modal */}
            <dialog id="upload_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Upload Product File</h3>
                    <div className="py-4 space-y-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Select Vendor*</span></div>
                            <select
                                className="select select-bordered"
                                value={selectedVendor}
                                onChange={(e) => setSelectedVendor(e.target.value)}
                            >
                                <option disabled value="">Pick one</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.company_name}</option>)}
                            </select>
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Select File*</span></div>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                        </label>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost">Cancel</button>
                        </form>
                        <button className="btn btn-primary" onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? <span className="loading loading-spinner"></span> : "Upload"}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ProductsPage;