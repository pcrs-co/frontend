// src/pages/admin/vendors/VendorListPage.jsx (UPDATED)
import { useNavigate } from "react-router-dom";
// Import the new, optimized hooks
import { useVendorsList, useVendorActions } from "../../../utils/hooks/useVendors";

export default function VendorListPage() {
    const navigate = useNavigate();

    // --- HOOKS (Now cleaner!) ---
    const { data: vendors, isLoading, error } = useVendorsList();
    const { deleteVendor, isPending: isDeleting } = useVendorActions(); // Renamed for clarity in hook

    const handleDelete = (vendorId, vendorName) => {
        if (window.confirm(`Are you sure you want to delete ${vendorName}?`)) {
            deleteVendor(vendorId, {
                onSuccess: () => alert("Vendor deleted successfully!"),
                onError: (err) => alert(`Error: ${err.message}`),
            });
        }
    };

    if (isLoading) { /* ... same as before */ }
    if (error) { /* ... same as before */ }

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
            <div className="overflow-x-auto bg-base-100 rounded-xl">
                <table className="table w-full">
                    {/* ... table head is the same ... */}
                    <tbody>
                        {vendors?.results.map((vendor) => ( // Note: Check if your API returns {results: []}
                            <tr key={vendor.id} className="hover">
                                <td>{vendor.user.username}</td>
                                <td>{vendor.user.email}</td>
                                <td>{vendor.company_name}</td>
                                <td className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            // THIS IS THE IMPORTANT CHANGE
                                            onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                                            className="btn btn-sm btn-outline btn-info"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor.id, vendor.company_name)}
                                            className="btn btn-sm btn-outline btn-error"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {/* ... no vendors found row is the same ... */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}