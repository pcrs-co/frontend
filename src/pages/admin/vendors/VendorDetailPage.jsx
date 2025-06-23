import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVendorDetails } from '../../../utils/hooks/useVendors';
import { useAdminProductsList } from '../../../utils/hooks/useAdminProducts'; // We can reuse this!

const VendorDetailPage = () => {
    const { vendorId } = useParams();

    // Fetch the specific vendor's details
    const { data: vendor, isLoading: isLoadingVendor, error: vendorError } = useVendorDetails(vendorId);

    // Fetch ALL products, we will filter them on the client-side for this vendor
    const { data: allProducts, isLoading: isLoadingProducts } = useAdminProductsList();

    if (isLoadingVendor || isLoadingProducts) {
        return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    }

    if (vendorError) {
        return <div className="p-6 alert alert-error">Error: {vendorError.message}</div>;
    }

    // Filter products to show only those belonging to the current vendor
    const vendorProducts = allProducts?.filter(p => p.vendor === parseInt(vendorId)) || [];

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <img src={vendor.logo || `https://ui-avatars.com/api/?name=${vendor.company_name}`} alt="Vendor Logo" className="w-20 h-20 rounded-full object-cover bg-base-300" />
                <div>
                    <h1 className="text-4xl font-bold">{vendor.company_name}</h1>
                    <p className="text-lg text-neutral-content">@{vendor.user.username}</p>
                </div>
            </div>

            {/* Vendor Details Card */}
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Vendor Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div><strong>Email:</strong> {vendor.user.email}</div>
                        <div><strong>Phone:</strong> {vendor.user.phone_number}</div>
                        <div><strong>Location:</strong> {vendor.location}</div>
                        <div><strong>Region:</strong> {vendor.user.region || 'N/A'}</div>
                        <div><strong>Member Since:</strong> {new Date(vendor.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* Vendor Products Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Products by {vendor.company_name} ({vendorProducts.length})</h2>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendorProducts.length > 0 ? vendorProducts.map(product => (
                                <tr key={product.id} className="hover">
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td className="text-right">
                                        <Link to={`/admin/products/${product.id}`} className="btn btn-sm btn-ghost">View Product</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-4">This vendor has no products yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailPage;