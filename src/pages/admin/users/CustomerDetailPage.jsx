import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomerDetails, useCustomerActions } from '../../../utils/hooks/useCustomers';

const CustomerDetailPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    // Fetching data
    const { data: customer, isLoading, error } = useCustomerDetails(userId);

    // Actions
    const { updateCustomer, isUpdating } = useCustomerActions();

    // When the customer data loads, populate our form state
    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username,
                email: customer.email,
                first_name: customer.first_name || '',
                last_name: customer.last_name || '',
            });
        }
    }, [customer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateCustomer({ id: userId, payload: formData }, {
            onSuccess: () => {
                setIsEditing(false);
                alert('Customer updated successfully!');
            },
            onError: (err) => {
                alert(`Update failed: ${err.message}`);
            }
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to the original customer data
        if (customer) {
            setFormData({
                username: customer.username,
                email: customer.email,
                first_name: customer.first_name,
                last_name: customer.last_name,
            });
        }
    };

    if (isLoading) return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    if (error) return <div className="p-6 alert alert-error">{error.message}</div>;
    if (!customer || !formData) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Customer Profile</h1>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-primary">
                        Edit Profile
                    </button>
                ) : (
                    <button onClick={handleCancel} className="btn btn-ghost">
                        Cancel
                    </button>
                )}
            </div>

            <form onSubmit={handleSave}>
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        {/* The two-column layout starts here */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Column 1: Smaller width for Avatar */}
                            <div className="md:col-span-1 flex flex-col items-center pt-4">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={`https://ui-avatars.com/api/?name=${customer.first_name}+${customer.last_name}&background=random&size=128`} alt="Customer Avatar" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold mt-4">{customer.first_name} {customer.last_name}</h2>
                                <p className="text-sm opacity-70">@{customer.username}</p>
                            </div>

                            {/* Column 2: Larger width for Details */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Username</span></label>
                                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Email Address</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">First Name</span></label>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Last Name</span></label>
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isEditing && (
                            <div className="card-actions justify-end mt-6">
                                <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                                    {isUpdating ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CustomerDetailPage;