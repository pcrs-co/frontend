import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomerDetails, useCustomerActions } from '../../../utils/hooks/useCustomers';
import { useAdminCustomerOrders } from '../../../utils/hooks/useOrders'; // New hook for orders
import { useToast } from '../../../context/ToastContext';

const CustomerDetailPage = () => {
    const { userId } = useParams();
    const { showSuccess, showError } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    // Fetching data
    const { data: customer, isLoading: isLoadingCustomer, error: customerError } = useCustomerDetails(userId);
    const { data: ordersResponse, isLoading: isLoadingOrders, error: ordersError } = useAdminCustomerOrders(userId);

    // Actions
    const { updateCustomer, isUpdating } = useCustomerActions();

    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username,
                email: customer.email,
                first_name: customer.first_name || '',
                last_name: customer.last_name || '',
                // Add other editable fields from your user model here
            });
        }
    }, [customer]);

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        // --- THIS IS THE FIX ---
        // Create a new payload object and explicitly exclude the username.
        const payload = {
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            // Add any other editable fields here if you have them in the form
            // e.g., phone_number: formData.phone_number
        };
        // The `formData` here contains `username`, `email`, `first_name`, etc.
        // This perfectly matches what the new `UpdateCustomerSerializer` expects.
        updateCustomer({ id: userId, payload: formData }, {
            onSuccess: () => {
                showSuccess('Customer updated successfully!');
                setIsEditing(false);
            },
            onError: (err) => showError(`Update failed: ${err.message}`)
        });
    };

    // --- Combined Loading and Error State Handling ---
    const isLoading = isLoadingCustomer || isLoadingOrders;
    const error = customerError || ordersError;

    if (isLoading) return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="p-6 alert alert-error">Error: {error.message}</div>;

    const recentOrders = ordersResponse?.results || [];
    const totalOrderCount = ordersResponse?.count || 0;

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={`https://ui-avatars.com/api/?name=${customer?.first_name}+${customer?.last_name}&background=random&size=128`} alt="Avatar" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">{customer?.first_name} {customer?.last_name}</h1>
                        <p className="text-lg text-neutral-content">@{customer?.username}</p>
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-primary">
                        Edit Customer
                    </button>
                )}
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleSave}>
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Username</span></label>
                                <input type="text" name="username" value={formData?.username || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Email Address</span></label>
                                <input type="email" name="email" value={formData?.email || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">First Name</span></label>
                                <input type="text" name="first_name" value={formData?.first_name || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Last Name</span></label>
                                <input type="text" name="last_name" value={formData?.last_name || ''} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                            </div>
                            <div><strong>Member Since:</strong> {new Date(customer?.date_joined).toLocaleDateString()}</div>
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

            {/* Recent Orders Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Recent Orders ({totalOrderCount})</h2>
                    {totalOrderCount > 3 && (
                        <Link to={`/admin/orders?user_id=${userId}`} className="btn btn-sm btn-outline btn-primary">View All Orders</Link>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? recentOrders.map(order => (
                                <tr key={order.id} className="hover">
                                    <td>#{order.id}</td>
                                    <td>{order.product_name}</td>
                                    <td><span className={`badge badge-ghost badge-sm`}>{order.status}</span></td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="text-right">
                                        <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-ghost">View Details</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center py-4">This customer has no orders yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;