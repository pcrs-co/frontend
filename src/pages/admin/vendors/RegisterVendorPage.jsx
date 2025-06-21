// src/pages/admin/vendors/RegisterVendorPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAction } from "../../../utils/hooks/useVendorAction";
// import { useToast } from "../../../context/ToastContext"; // Optional: for notifications

export default function RegisterVendorPage() {
    const navigate = useNavigate();
    // const showToast = useToast(); // Optional

    // --- HOOKS ---
    const { createVendor, isCreating, createError } = useVendorAction();

    // --- STATE ---
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        company_name: "",
        phone_number: "",
        region: "",
        district: "",
        location: "",
        password: "", // Add a password confirmation field for better UX
        logo: null,
    });
    const [logoPreview, setLogoPreview] = useState(null);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "logo") {
            const file = files[0];
            setFormData({ ...formData, logo: file });
            setLogoPreview(file ? URL.createObjectURL(file) : null);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // The component's job is just to call the hook's function
        await createVendor(formData, {
            onSuccess: (newVendor) => {
                // showToast(`Vendor "${newVendor.company_name}" created successfully!`, "success");
                alert("Vendor created successfully!"); // Use if no toast context
                navigate("/admin/vendors");
            },
            onError: (err) => {
                // The hook already sets the error state, so we just log or show a generic toast.
                console.error("Registration failed:", err);
                // showToast("Registration failed. Please check the form for errors.", "error");
                alert("Registration failed. Please check the form for errors.");
            }
        });
    };

    // --- RENDER LOGIC ---
    // Helper function to get error messages from the hook's error state
    const getError = (fieldName) => {
        if (!createError || !createError[fieldName]) return null;
        // Django returns errors as an array, so we take the first one.
        return createError[fieldName][0];
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Register New Vendor</h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Display a generic error message at the top if one exists */}
                {createError?.detail && (
                    <div className="alert alert-error">
                        <span>{createError.detail}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* --- Column 1 --- */}
                    <div className="space-y-4">
                        {/* Company Name */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Company Name*</span></label>
                            <input type="text" name="company_name" placeholder="Acme Inc." className={`input input-bordered w-full ${getError('company_name') ? 'input-error' : ''}`} value={formData.company_name} onChange={handleChange} required />
                            {getError('company_name') && <label className="label"><span className="label-text-alt text-error">{getError('company_name')}</span></label>}
                        </div>
                        {/* Location */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Location*</span></label>
                            <input type="text" name="location" placeholder="Business Location" className={`input input-bordered w-full ${getError('location') ? 'input-error' : ''}`} value={formData.location} onChange={handleChange} required />
                            {getError('location') && <label className="label"><span className="label-text-alt text-error">{getError('location')}</span></label>}
                        </div>
                        {/* Email */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Contact Email*</span></label>
                            <input type="email" name="email" placeholder="contact@acme.inc" className={`input input-bordered w-full ${getError('email') ? 'input-error' : ''}`} value={formData.email} onChange={handleChange} required />
                            {getError('email') && <label className="label"><span className="label-text-alt text-error">{getError('email')}</span></label>}
                        </div>
                        {/* Phone Number */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Phone Number*</span></label>
                            <input type="text" name="phone_number" placeholder="+255..." className={`input input-bordered w-full ${getError('phone_number') ? 'input-error' : ''}`} value={formData.phone_number} onChange={handleChange} required />
                            {getError('phone_number') && <label className="label"><span className="label-text-alt text-error">{getError('phone_number')}</span></label>}
                        </div>
                        {/* Logo */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Company Logo</span></label>
                            <input type="file" name="logo" accept="image/*" className={`file-input file-input-bordered w-full ${getError('logo') ? 'file-input-error' : ''}`} onChange={handleChange} />
                            {getError('logo') && <label className="label"><span className="label-text-alt text-error">{getError('logo')}</span></label>}
                            {logoPreview && <div className="mt-4"><img src={logoPreview} alt="Logo preview" className="h-24 w-24 object-contain rounded-lg" /></div>}
                        </div>
                    </div>

                    {/* --- Column 2 --- */}
                    <div className="space-y-4">
                        {/* Username */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Admin Username*</span></label>
                            <input type="text" name="username" placeholder="vendor_admin" className={`input input-bordered w-full ${getError('username') ? 'input-error' : ''}`} value={formData.username} onChange={handleChange} required />
                            {getError('username') && <label className="label"><span className="label-text-alt text-error">{getError('username')}</span></label>}
                        </div>
                        {/* Password */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password*</span></label>
                            <input type="password" name="password" placeholder="••••••••" className={`input input-bordered w-full ${getError('password') ? 'input-error' : ''}`} value={formData.password} onChange={handleChange} required />
                            {getError('password') && <label className="label"><span className="label-text-alt text-error">{getError('password')}</span></label>}
                        </div>
                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">First Name</span></label>
                                <input type="text" name="first_name" placeholder="John" className="input input-bordered w-full" value={formData.first_name} onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Last Name</span></label>
                                <input type="text" name="last_name" placeholder="Doe" className="input input-bordered w-full" value={formData.last_name} onChange={handleChange} />
                            </div>
                        </div>
                        {/* Region & District */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Region</span></label>
                                <input type="text" name="region" placeholder="e.g., Dar es Salaam" className="input input-bordered w-full" value={formData.region} onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">District</span></label>
                                <input type="text" name="district" placeholder="e.g., Kinondoni" className="input input-bordered w-full" value={formData.district} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button type="submit" className="btn btn-primary" disabled={isCreating}>
                        {isCreating ? (<><span className="loading loading-spinner"></span> Registering...</>) : "Register Vendor"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin/vendors")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}