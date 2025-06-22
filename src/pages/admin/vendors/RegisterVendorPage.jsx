// src/pages/admin/vendors/RegisterVendorPage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAction } from "../../../utils/hooks/useVendorAction";

// Import the Google Maps components
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ["places"]; // Define libraries outside component to prevent re-renders
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Access the key from .env

export default function RegisterVendorPage() {
    const navigate = useNavigate();
    const { createVendor, isCreating, createError } = useVendorAction();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        company_name: "",
        phone_number: "",
        region: "",
        location: "",
        logo: null,
    });

    const autocompleteRef = useRef(null);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "logo") {
            setFormData({ ...formData, logo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handler for when a place is selected from Google Maps dropdown
    const handlePlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                setFormData({
                    ...formData,
                    location: place.formatted_address,
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createVendor(formData, {
            onSuccess: () => {
                alert("Vendor created successfully!");
                navigate("/admin/vendors");
            },
            onError: (err) => {
                console.error("Registration failed:", err);
                alert("Registration failed. Please check the form for errors.");
            }
        });
    };

    const getError = (fieldName) => {
        if (!createError || !createError[fieldName]) return null;
        return createError[fieldName][0];
    };

    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing. Please check your .env file.</div>;
    }

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
            <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Register New Vendor</h2>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {createError?.detail && (
                        <div className="alert alert-error"><span>{createError.detail}</span></div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Company Name*</span></label>
                                <input type="text" name="company_name" placeholder="Acme Inc." className={`input input-bordered w-full ${getError('company_name') ? 'input-error' : ''}`} value={formData.company_name} onChange={handleChange} required />
                                {getError('company_name') && <label className="label"><span className="label-text-alt text-error">{getError('company_name')}</span></label>}
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Location*</span></label>
                                <Autocomplete onLoad={(ref) => autocompleteRef.current = ref} onPlaceChanged={handlePlaceChanged}>
                                    <input type="text" placeholder="Search for business address" className={`input input-bordered w-full ${getError('location') ? 'input-error' : ''}`} defaultValue={formData.location} />
                                </Autocomplete>
                                {getError('location') && <label className="label"><span className="label-text-alt text-error">{getError('location')}</span></label>}
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Contact Email*</span></label>
                                <input type="email" name="email" placeholder="contact@acme.inc" className={`input input-bordered w-full ${getError('email') ? 'input-error' : ''}`} value={formData.email} onChange={handleChange} required />
                                {getError('email') && <label className="label"><span className="label-text-alt text-error">{getError('email')}</span></label>}
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Company Username*</span></label>
                                <input type="text" name="username" placeholder="vendor_admin" className={`input input-bordered w-full ${getError('username') ? 'input-error' : ''}`} value={formData.username} onChange={handleChange} required />
                                {getError('username') && <label className="label"><span className="label-text-alt text-error">{getError('username')}</span></label>}
                            </div>

                            {/* --- SIMPLIFIED PHONE NUMBER INPUT --- */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number*</span></label>
                                <input type="tel" name="phone_number" placeholder="+255..." className={`input input-bordered w-full ${getError('phone_number') ? 'input-error' : ''}`} value={formData.phone_number} onChange={handleChange} required />
                                {getError('phone_number') && <label className="label"><span className="label-text-alt text-error">{getError('phone_number')}</span></label>}
                            </div>

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
                            {isCreating ? <span className="loading loading-spinner"></span> : "Register Vendor"}
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin/vendors")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </LoadScript>
    );
}