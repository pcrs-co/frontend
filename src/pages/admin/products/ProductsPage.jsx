// src/pages/admin/products/ProductsPage.jsx
import React, { useState } from 'react';
import { useAdminProductsList, useAdminProductActions, useAdminProductUpload } from '../../../utils/hooks/useAdminProducts';
import { useVendorsList } from '../../../utils/hooks/useVendors';

const ProductsPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState('');

    // --- CORRECTED HOOK USAGE ---
    const { data: productsData, isLoading: isLoadingProducts } = useAdminProductsList();
    // Correctly destructure 'data' and 'isLoading' from the useQuery return object
    const { data: vendorsData, isLoading: isLoadingVendors } = useVendorsList();

    // Extract the actual arrays from the 'data' object.
    // Handle the case where the API might not be paginated.
    const products = productsData?.results || productsData || [];
    const vendors = vendorsData?.results || vendorsData || [];
    // --- END OF CORRECTIONS ---

    const { deleteProduct, isDeleting } = useAdminProductActions();
    const { mutate: uploadProducts, isPending: isUploading } = useAdminProductUpload();

    const handleUpload = () => {
        if (!selectedFile || !selectedVendor) {
            alert('Please select a vendor and a file.');
            return;
        }
        uploadProducts({ vendorId: selectedVendor, file: selectedFile }, {
            onSuccess: () => {
                // Better to close the modal on success
                document.getElementById('upload_modal').close();
                setSelectedFile(null);
                setSelectedVendor('');
            }
        });
    };

    // Use the correct loading variables
    if (isLoadingProducts || isLoadingVendors) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* The rest of your JSX is mostly fine */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">All Products</h1>
                <button className="btn btn-primary" onClick={() => document.getElementById('upload_modal').showModal()}>
                    Upload Products
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* ... Table Head ... */}
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
                                {/* Use the correctly extracted vendors array */}
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.company_name}</option>)}
                            </select>
                        </label>
                        {/* ... other inputs */}
                    </div>
                    {/* ... modal actions */}
                </div>
            </dialog>
        </div>
    );
};

export default ProductsPage;