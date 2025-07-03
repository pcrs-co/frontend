// src/components/admin/dashboard/RecentActivityTable.jsx
import { Link } from 'react-router-dom';

const RecentActivityTable = ({ title, items = [], columns = [], linkToBase, isLoading }) => {

    // DaisyUI skeleton for the table
    const renderLoading = () => (
        <div className="card-body">
            <div className="h-8 w-1/2 skeleton mb-4"></div>
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="h-5 w-2/4 skeleton"></div>
                        <div className="h-5 w-1/4 skeleton"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => (
        <div className="card-body">
            <div className="flex justify-between items-center">
                <h2 className="card-title">{title}</h2>
                <Link to={linkToBase} className="btn btn-sm btn-ghost normal-case">View All →</Link>
            </div>
            <div className="overflow-x-auto mt-2">
                <table className="table table-sm w-full">
                    <thead>
                        <tr>
                            {columns.map(col => <th key={col.header}>{col.header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item.id} className="hover">
                                {columns.map(col => (
                                    <td key={`${item.id}-${col.accessor}`}>
                                        {col.render ? col.render(item) : item[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr><td colSpan={columns.length} className="text-center py-4">No recent activity.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="card bg-base-100 shadow-xl">
            {isLoading ? renderLoading() : renderContent()}
        </div>
    )
};

export default RecentActivityTable;