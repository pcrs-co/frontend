// src/pages/UserProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/hooks/useAuth';
import { useToast } from '../context/ToastContext';

// Import the new history components
import OrdersHistory from '../components/customer/OrdersHistory';
import RecommendationsHistory from '../components/customer/RecommendationsHistory';

export default function UserProfilePage() {
    const { showToast } = useToast();
    const { user, isLoading, error, updateProfile, isUpdatingProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ /* ... as before ... */ });
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'recs'

    const userRole = user?.role;
    const isVendor = userRole === 'vendor';

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                company_name: user.vendor_profile?.company_name || '',
                location: user.vendor_profile?.location || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        let payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
        };
        if (isVendor) {
            payload.vendor_profile_write = {
                company_name: formData.company_name,
                location: formData.location,
            };
        } else {
            payload.email = formData.email;
        }
        updateProfile(payload, {
            onSuccess: () => {
                showToast({ message: 'Profile updated successfully!', type: 'success' });
                setIsEditing(false);
            },
            onError: (err) => {
                const errorMessage = err.response?.data?.detail || err.message;
                showToast({ message: `Update failed: ${errorMessage}`, type: 'error' });
            }
        });
    };

    if (isLoading) return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="p-6 alert alert-error">Error loading profile: {error.message}</div>;
    if (!user) return <div className="p-6 text-center">User not found. Please log in again.</div>;

    const displayName = isVendor && user.vendor_profile?.company_name ? user.vendor_profile.company_name : `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    const avatarName = displayName || user.username;

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-20 sm:w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user.vendor_profile?.logo || `https://ui-avatars.com/api/?name=${avatarName.replace(/\s/g, "+")}&background=random&size=128`} alt="Avatar" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold">{displayName}</h1>
                        <p className="text-base sm:text-lg text-neutral-content">@{user.username}</p>
                        <span className="badge badge-primary mt-2 capitalize">{userRole}</span>
                    </div>
                </div>
            </div>

            {/* --- TABBED INTERFACE --- */}
            <div role="tablist" className="tabs tabs-lifted">
                <a role="tab" className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`} onClick={() => setActiveTab('profile')}>My Profile</a>
                {!isVendor && <a role="tab" className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`} onClick={() => setActiveTab('orders')}>Order History</a>}
                {!isVendor && <a role="tab" className={`tab ${activeTab === 'recs' ? 'tab-active' : ''}`} onClick={() => setActiveTab('recs')}>Recommendation History</a>}
            </div>

            {/* --- TAB CONTENT --- */}
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSave}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">My Information</h2>
                                {!isEditing ? (
                                    <button type="button" onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm btn-primary">Edit</button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-sm btn-ghost">Cancel</button>
                                        <button type="submit" className="btn btn-sm btn-primary" disabled={isUpdatingProfile}>
                                            {isUpdatingProfile ? <span className="loading loading-spinner"></span> : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ... Your existing form fields for vendor/customer ... */}
                            {isVendor ? (
                                // Vendor Fields
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Company Name</span></label>
                                        <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Location</span></label>
                                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                </div>
                            ) : (
                                // Customer Fields
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">First Name</span></label>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Last Name</span></label>
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text">Email Address</span></label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                </div>
                            )}
                        </form>
                    )}

                    {activeTab === 'orders' && <OrdersHistory />}
                    {activeTab === 'recs' && <RecommendationsHistory />}
                </div>
            </div>
        </div>
    );
}