import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVendorDetails, useVendorActions } from '../../../utils/hooks/useVendors';
import { useAdminVendorProducts } from '../../../utils/hooks/useAdminProducts';
import { useToast } from '../../../context/ToastContext';

const VendorDetailPage = () => {
    const { vendorId } = useParams();
    const { showToast } = useToast();

    // State for toggling between view and edit mode
    const [isEditing, setIsEditing] = useState(false);
    // State to hold form data while editing
    const [formData, setFormData] = useState(null);

    // Fetching data
    const { data: vendor, isLoading: isLoadingVendor, error: vendorError } = useVendorDetails(vendorId);
    const { data: productsResponse, isLoading: isLoadingProducts, error: productsError } = useAdminVendorProducts(vendorId);

    // Actions
    const { updateVendor, isUpdating } = useVendorActions();

    // When vendor data loads, populate our form state
    useEffect(() => {
        if (vendor) {
            setFormData({
                company_name: vendor.company_name,
                location: vendor.location,
                // User-related fields are often handled separately or are read-only for admins
                phone_number: vendor.user.phone_number,
            });
        }
    }, [vendor]);

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateVendor({ id: vendorId, data: formData }, {
            onSuccess: () => {
                showToast({ message: 'Vendor updated successfully!', type: 'success' });
                setIsEditing(false);
            },
            onError: (err) => {
                const errorMessage = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
                showToast({ message: `Update failed: ${errorMessage}`, type: 'error' });
            }
        });
    };

    // --- Combined Loading and Error State Handling ---
    const isLoading = isLoadingVendor || isLoadingProducts;
    const error = vendorError || productsError;

    if (isLoading) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if (error) {
        return <div className="p-6 alert alert-error">Error: {error.message}</div>;
    }

    const recentProducts = productsResponse?.results || [];
    const totalProductCount = productsResponse?.count || 0;

    return (
        <div className="p-6 space-y-8">
            {/* Header section with Edit button */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <img src={vendor?.logo || `https://ui-avatars.com/api/?name=${vendor?.company_name?.replace(/\s/g, "+")}`} alt="Vendor Logo" className="w-20 h-20 rounded-full object-cover bg-base-300" />
                    <div>
                        <h1 className="text-4xl font-bold">{vendor?.company_name}</h1>
                        <p className="text-lg text-neutral-content">@{vendor?.user?.username}</p>
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-primary">
                        Edit Vendor
                    </button>
                )}
            </div>

            {/* Vendor Details Card becomes an editable form */}
            <form onSubmit={handleSave}>
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Vendor Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* Company Name */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Company Name</span></label>
                                <input type="text" name="company_name" value={formData?.company_name || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            {/* Location */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Location</span></label>
                                <input type="text" name="location" value={formData?.location || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            {/* Phone Number */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone</span></label>
                                <input type="text" name="phone_number" value={formData?.phone_number || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            {/* Read-only fields */}
                            <div><strong>Email:</strong> {vendor?.user?.email || 'N/A'}</div>
                            <div><strong>Region:</strong> {vendor?.user?.region || 'N/A'}</div>
                            <div><strong>Member Since:</strong> {new Date(vendor?.created_at).toLocaleDateString()}</div>
                        </div>
                        {isEditing && (
                            <div className="card-actions justify-end mt-6 space-x-2">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                                    {isUpdating ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {/* Product Section (no changes needed here) */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Recent Products ({totalProductCount})</h2>
                    {totalProductCount > 3 && (
                        <Link to={`/admin/products?vendor=${vendorId}`} className="btn btn-sm btn-outline btn-primary">View All Products</Link>
                    )}
                </div>
                {/* ...table for products... */}
            </div>
        </div>
    );
};

export default VendorDetailPage;