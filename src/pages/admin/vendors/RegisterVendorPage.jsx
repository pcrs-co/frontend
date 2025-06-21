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
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrors({});

        try {
            await createVendor(formData);
            navigate("/admin/vendors");
        } catch (err) {
            if (err.response && err.response.data) {
                // Handle validation errors
                const responseErrors = err.response.data;

                // Convert nested errors to flat structure for display
                const flattenedErrors = {};
                Object.keys(responseErrors).forEach(key => {
                    if (Array.isArray(responseErrors[key])) {
                        flattenedErrors[key] = responseErrors[key][0];
                    } else {
                        flattenedErrors[key] = responseErrors[key];
                    }
                });

                setErrors(flattenedErrors);

                // Set generic error message if no field-specific errors
                if (Object.keys(flattenedErrors).length === 0) {
                    setError("Registration failed. Please try again.");
                }
            } else {
                setError("Registration failed. Please check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-base-100 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Register Vendor</h2>

            {error && !Object.keys(errors).length && (
                <div className="alert alert-error mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
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
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                <div>
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
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className={`input input-bordered w-full ${errors.first_name ? 'input-error' : ''}`}
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className={`input input-bordered w-full ${errors.last_name ? 'input-error' : ''}`}
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                    )}
                </div>

                <div>
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
                        <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number (e.g., +255...)"
                        className={`input input-bordered w-full ${errors.phone_number ? 'input-error' : ''}`}
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                    {errors.phone_number && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (leave blank to generate)"
                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div className="flex gap-4">
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
                        ) : "Register"}
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