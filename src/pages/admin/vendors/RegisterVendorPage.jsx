import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendors } from "../../../utils/hooks/useVendors";

export default function RegisterVendorPage() {
    const navigate = useNavigate();
    const { createVendor } = useVendors();

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
        password: "",
        logo: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const handleChange = (e) => {
        if (e.target.name === "logo") {
            const file = e.target.files[0];
            setFormData({ ...formData, logo: file });

            // Create preview
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setLogoPreview(null);
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrors({});

        // Prepare form data for file upload
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            await createVendor(formDataToSend);
            navigate("/admin/vendors");
        } catch (err) {
            if (err.response && err.response.data) {
                const responseErrors = err.response.data;
                const flattenedErrors = {};

                Object.keys(responseErrors).forEach(key => {
                    if (Array.isArray(responseErrors[key])) {
                        flattenedErrors[key] = responseErrors[key][0];
                    } else if (typeof responseErrors[key] === 'object') {
                        // Handle nested errors
                        Object.keys(responseErrors[key]).forEach(nestedKey => {
                            flattenedErrors[`${key}.${nestedKey}`] = responseErrors[key][nestedKey][0];
                        });
                    } else {
                        flattenedErrors[key] = responseErrors[key];
                    }
                });

                setErrors(flattenedErrors);

                if (Object.keys(flattenedErrors).length === 0) {
                    setError("Registration failed. Please try again.");
                }
            } else {
                setError(err.message || "Registration failed. Please check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Register Vendor</h2>

            {error && !Object.keys(errors).length && (
                <div className="alert alert-error mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Name*</span>
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                placeholder="Company Name"
                                className={`input input-bordered w-full ${errors.company_name ? 'input-error' : ''}`}
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.company_name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.company_name}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Business Location"
                                className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                            {errors.location && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.location}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number*</span>
                            </label>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="+255..."
                                className={`input input-bordered w-full ${errors.phone_number ? 'input-error' : ''}`}
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                            {errors.phone_number && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.phone_number}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Logo</span>
                            </label>
                            <input
                                type="file"
                                name="logo"
                                accept="image/*"
                                className={`file-input file-input-bordered w-full ${errors.logo ? 'file-input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.logo && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.logo}</span>
                                </label>
                            )}
                            {logoPreview && (
                                <div className="mt-2">
                                    <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-contain rounded" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username*</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            {errors.username && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.username}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">First Name</span>
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                className={`input input-bordered w-full ${errors.first_name ? 'input-error' : ''}`}
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                            {errors.first_name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.first_name}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                className={`input input-bordered w-full ${errors.last_name ? 'input-error' : ''}`}
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                            {errors.last_name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.last_name}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Region</span>
                            </label>
                            <input
                                type="text"
                                name="region"
                                placeholder="Region"
                                className={`input input-bordered w-full ${errors.region ? 'input-error' : ''}`}
                                value={formData.region}
                                onChange={handleChange}
                            />
                            {errors.region && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.region}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">District</span>
                            </label>
                            <input
                                type="text"
                                name="district"
                                placeholder="District"
                                className={`input input-bordered w-full ${errors.district ? 'input-error' : ''}`}
                                value={formData.district}
                                onChange={handleChange}
                            />
                            {errors.district && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.district}</span>
                                </label>
                            )}
                        </div>

                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Registering...
                            </>
                        ) : (
                            "Register Vendor"
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate("/admin/vendors")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}