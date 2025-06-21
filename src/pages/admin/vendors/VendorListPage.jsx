// src/pages/admin/vendors/VendorListPage.jsx
import { useVendors } from "../../../utils/hooks/useVendors";
import { useNavigate } from "react-router-dom";

export default function VendorListPage() {
    const navigate = useNavigate();
    const { vendors, loading, removeVendor } = useVendors();

    const handleDelete = async (id) => {
        if (confirm("Delete this vendor?")) {
            await removeVendor(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Vendors</h2>
                <button
                    onClick={() => navigate("/admin/vendors/register")}
                    className="btn btn-primary"
                >
                    + Add Vendor
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td>{vendor.username}</td>
                                    <td>{vendor.email}</td>
                                    <td>{vendor.company_name}</td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                                            className="btn btn-sm btn-info"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor.id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {vendors.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-400">
                                        No vendors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
