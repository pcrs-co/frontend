import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/hooks/useAuth';
import { useToast } from '../context/ToastContext';

const UserProfilePage = () => {
    const { showSuccess, showError } = useToast();
    // The useAuth hook doesn't need to change, as it just fetches whatever the API returns.
    const { user, isLoading, error, updateProfile, isUpdatingProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // The user's role now comes directly from the API response!
    const userRole = user?.role;
    const isVendor = userRole === 'vendor';

    useEffect(() => {
        if (user) {
            // The data structure is now consistent
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                // Vendor fields are now neatly nested
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

        let payload = {};

        if (isVendor) {
            // ** THIS IS THE FIX **
            // The payload key must match the `write_only=True` field in the serializer.
            payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                // The key is `vendor_profile_write`
                vendor_profile_write: {
                    company_name: formData.company_name,
                    location: formData.location,
                }
            };
        } else { // Customer or Admin
            payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
            };
        }

        updateProfile(payload, {
            onSuccess: () => {
                showSuccess('Profile updated successfully!');
                setIsEditing(false);
            },
            onError: (err) => {
                const errorMessage = err.response?.data?.detail || err.message;
                showError(`Update failed: ${errorMessage}`);
            }
        });
    };
    // --- Render Logic ---
    if (isLoading) return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="p-6 alert alert-error">Error loading profile: {error.message}</div>;
    if (!user) return <div className="p-6 text-center">User not found. Please log in again.</div>;

    // Determine the display name based on the role from the API.
    let displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    if (isVendor && user.vendor_profile?.company_name) {
        displayName = user.vendor_profile.company_name;
    } else if (!displayName) {
        displayName = user.username;
    }

    const avatarName = displayName || user.username;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user.vendor_profile?.logo || `https://ui-avatars.com/api/?name=${avatarName.replace(/\s/g, "+")}&background=random&size=128`} alt="Avatar" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">{displayName}</h1>
                        <p className="text-lg text-neutral-content">@{user.username}</p>
                        <span className="badge badge-primary mt-2 capitalize">{userRole}</span>
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-primary">
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Details Form */}
            <form onSubmit={handleSave}>
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">My Information</h2>

                        {/* Vendor-Specific Fields */}
                        {isVendor && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Company Name</span></label>
                                        <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Location</span></label>
                                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing} />
                                    </div>
                                </div>
                                <div className="divider">Contact Person Details</div>
                            </>
                        )}

                        {/* Common Fields for All Users */}
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
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input input-bordered" disabled={!isEditing || isVendor} />
                                {isVendor && <div className="text-xs text-warning p-1">Contact support to change vendor email.</div>}
                            </div>
                        </div>

                        {/* Edit Mode Actions */}
                        {isEditing && (
                            <div className="card-actions justify-end mt-6 space-x-2">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                                    {isUpdatingProfile ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfilePage;