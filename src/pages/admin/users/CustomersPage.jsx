import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import { useAdminResourceList } from '../../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../../utils/hooks/useAdminResourceActions';

const CustomersPage = () => {
    const navigate = useNavigate(); // <-- Initialize navigate
    const resourceName = 'customers';
    const { data: customersResponse, isLoading } = useAdminResourceList(resourceName);
    const { deleteItem: deleteCustomer, isPending: isDeleting } = useAdminResourceActions(resourceName);

    // API might return paginated response, e.g., { results: [...] }
    const customers = customersResponse?.results || customersResponse || [];

    const handleDelete = (id, username) => {
        if (window.confirm(`Are you sure you want to delete the user: ${username}?`)) {
            deleteCustomer(id);
        }
    }

    if (isLoading) {
        return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">All Customers</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers?.map(customer => (
                            <tr key={customer.id} className="hover">
                                <td>{customer.username}</td>
                                <td>{customer.email}</td>
                                <td className="text-right">
                                    {/* Action buttons */}
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => navigate(`/admin/users/${customer.id}`)}
                                            className="btn btn-sm btn-outline btn-info"
                                        >
                                            View / Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id, customer.username)}
                                            className="btn btn-sm btn-outline btn-error"
                                            disabled={isDeleting}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomersPage;