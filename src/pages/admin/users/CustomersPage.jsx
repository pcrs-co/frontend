// src/pages/admin/users/CustomersPage.jsx
import React from 'react';
import { useAdminResourceList } from '../../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../../utils/hooks/useAdminResourceActions';

const CustomersPage = () => {
    const resourceName = 'customers';
    const { data: customers, isLoading } = useAdminResourceList(resourceName);
    const { deleteItem: deleteCustomer, isPending: isDeleting } = useAdminResourceActions(resourceName);

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
                                    <button
                                        onClick={() => deleteCustomer(customer.id)}
                                        className="btn btn-sm btn-error"
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </button>
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