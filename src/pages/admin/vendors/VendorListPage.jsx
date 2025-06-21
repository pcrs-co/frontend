// src/pages/admin/vendors/VendorListPage.jsx
import { useNavigate } from "react-router-dom";
import { useVendors } from "../../../utils/hooks/useVendors";
import { useVendorAction } from "../../../utils/hooks/useVendorAction";
// import { useToast } from "../../../context/ToastContext"; // Optional: for notifications

export default function VendorListPage() {
    const navigate = useNavigate();

    // --- HOOKS ---
    // 1. For QUERYING the list of vendors
    const { vendors, loading: isLoadingList, error, refetch } = useVendors();

    // 2. For performing ACTIONS (like deleting) on a vendor
    const { deleteVendor, isDeleting } = useVendorAction();

    // const showToast = useToast(); // Optional

    // --- HANDLERS ---
    const handleDelete = async (vendorId, vendorName) => {
        if (window.confirm(`Are you sure you want to delete the vendor: ${vendorName}?`)) {
            await deleteVendor(vendorId, {
                onSuccess: () => {
                    // showToast("Vendor deleted successfully!", "success");
                    alert("Vendor deleted successfully!"); // Use if no toast context
                    refetch(); // Automatically refresh the vendor list
                },
                onError: (err) => {
                    const errorMessage = err.message || "Could not delete vendor. Please try again.";
                    // showToast(errorMessage, "error");
                    alert(`Error: ${errorMessage}`); // Use if no toast context
                }
            });
        }
    };

    // --- RENDER LOGIC ---
    if (isLoadingList) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">Error: {error.message}</div>;
    }

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
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor.id} className="hover">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={vendor.logo || `https://ui-avatars.com/api/?name=${vendor.username}&background=random`} alt={`${vendor.username}'s avatar`} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{vendor.first_name} {vendor.last_name}</div>
                                            <div className="text-sm opacity-50">@{vendor.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{vendor.email}</td>
                                <td>{vendor.company_name}</td>
                                <td className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                                            className="btn btn-sm btn-outline btn-info"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor.id, vendor.company_name)}
                                            className="btn btn-sm btn-outline btn-error"
                                            disabled={isDeleting} // Disable button while a delete is in progress
                                        >
                                            {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {vendors.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-10">
                                    No vendors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}