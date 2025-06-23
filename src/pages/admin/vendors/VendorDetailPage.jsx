import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVendorDetails } from '../../../utils/hooks/useVendors';
import { useAdminVendorProducts } from '../../../utils/hooks/useAdminProducts'; // Use the new, specific hook

const VendorDetailPage = () => {
    const { vendorId } = useParams();

    // Fetch the specific vendor's details
    const { data: vendor, isLoading: isLoadingVendor, error: vendorError } = useVendorDetails(vendorId);

    // Fetch ONLY the 3 most recent products for THIS vendor
    const { data: productsResponse, isLoading: isLoadingProducts, error: productsError } = useAdminVendorProducts(vendorId);

    // --- Combined Loading and Error State Handling ---
    const isLoading = isLoadingVendor || isLoadingProducts;
    const error = vendorError || productsError;

    if (isLoading) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div className="p-6 alert alert-error">Error: {error.message}</div>;
    }

    // Safely extract data with fallbacks
    const recentProducts = productsResponse?.results || [];
    const totalProductCount = productsResponse?.count || 0;

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <img src={vendor?.logo || `https://ui-avatars.com/api/?name=${vendor?.company_name?.replace(/\s/g, "+")}`} alt="Vendor Logo" className="w-20 h-20 rounded-full object-cover bg-base-300" />
                <div>
                    <h1 className="text-4xl font-bold">{vendor?.company_name}</h1>
                    <p className="text-lg text-neutral-content">@{vendor?.user?.username}</p>
                </div>
            </div>

            {/* Vendor Details Card */}
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Vendor Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div><strong>Email:</strong> {vendor?.user?.email || 'N/A'}</div>
                        <div><strong>Phone:</strong> {vendor?.user?.phone_number || 'N/A'}</div>
                        <div><strong>Location:</strong> {vendor?.location || 'N/A'}</div>
                        <div><strong>Region:</strong> {vendor?.user?.region || 'N/A'}</div>
                        <div><strong>Member Since:</strong> {new Date(vendor?.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* Vendor Products Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Recent Products ({totalProductCount})</h2>
                    {totalProductCount > 3 && (
                        // Link to a full, paginated list of this vendor's products
                        // This link should go to your main products page with a filter applied
                        <Link to={`/admin/products?vendor=${vendorId}`} className="btn btn-sm btn-outline btn-primary">
                            View All Products
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.length > 0 ? (
                                recentProducts.map(product => (
                                    <tr key={product.id} className="hover">
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td className="text-right">
                                            <Link to={`/admin/products/${product.id}`} className="btn btn-sm btn-ghost">View Details</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
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