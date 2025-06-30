// src/pages/vendor/Dashboard.jsx
import React from 'react';
import { useVendorProducts } from '../../utils/hooks/useVendorProducts';
import { useOrdersList } from '../../utils/hooks/useOrders';
import { useAuth } from '../../utils/hooks/useAuth'; // <-- 1. IMPORT useAuth
import StatCard from '../../components/admin/dashboard/StatCard';
import { ShoppingBagIcon, InboxIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
    // --- Data Hooks ---
    const { user, isLoading: isLoadingUser } = useAuth(); // <-- 2. GET USER DATA
    const { products, isLoading: isLoadingProducts } = useVendorProducts();
    const { data: ordersResponse, isLoading: isLoadingOrders } = useOrdersList();
    
    // --- Data Processing ---
    const allOrders = ordersResponse?.results || ordersResponse || [];
    const productCount = products?.length || 0;
    const pendingOrders = allOrders.filter(o => o.status === 'pending');
    const confirmedOrders = allOrders.filter(o => o.status === 'confirmed');

    const totalRevenue = confirmedOrders.reduce((sum, order) => {
        const price = parseFloat(order.product?.price || 0);
        return sum + (order.quantity * price);
    }, 0);

    // --- Display Name & Avatar Logic ---
    const displayName = user?.vendor_profile?.company_name || user?.username || 'Vendor';
    const avatarName = displayName.replace(/\s/g, "+");

    // Show a single loading spinner if the main user profile is still fetching
    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* --- 3. ADDED PROFILE HEADER --- */}
            <div className="flex items-center gap-4">
                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {/* Use the logo from vendor_profile if it exists, otherwise use the generated avatar */}
                        <img src={user?.vendor_profile?.logo || `https://ui-avatars.com/api/?name=${avatarName}&background=random&size=128`} alt="Company Logo or Avatar" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold">{displayName}</h1>
                    <p className="text-lg text-neutral-content">@{user?.username}</p>
                    <Link to="/profile" className="btn btn-sm btn-outline btn-primary mt-2">
                        View Profile
                    </Link>
                </div>
            </div>
            {/* --- END OF PROFILE HEADER --- */}
            
            {/* --- Stat Cards (Existing Code) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<ShoppingBagIcon className="h-8 w-8" />}
                    title="Total Products"
                    value={productCount}
                    description="Live product listings"
                    isLoading={isLoadingProducts}
                    linkTo="/vendor/products"
                />
                <StatCard 
                    icon={<InboxIcon className="h-8 w-8" />}
                    title="Pending Orders"
                    value={pendingOrders.length}
                    description="Ready to be confirmed"
                    isLoading={isLoadingOrders}
                    linkTo="/vendor/orders"
                />
                <StatCard 
                    icon={<CheckCircleIcon className="h-8 w-8" />}
                    title="Fulfilled Orders"
                    value={confirmedOrders.length}
                    description="Total orders completed"
                    isLoading={isLoadingOrders}
                />
                <StatCard 
                    icon={<CurrencyDollarIcon className="h-8 w-8" />}
                    title="Total Sales"
                    value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    description="From confirmed orders"
                    isLoading={isLoadingOrders}
                />
            </div>
            
            {/* --- Recent Pending Orders Table (Existing Code) --- */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <h2 className="card-title">Awaiting Confirmation</h2>
                        <Link to="/vendor/orders" className="btn btn-sm btn-ghost">View All →</Link>
                    </div>
                    <div className="overflow-x-auto mt-4">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingOrders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="hover">
                                        <td className="font-mono">#{order.id}</td>
                                        <td>{order.product?.name || 'N/A'}</td>
                                        <td>{order.quantity}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {pendingOrders.length === 0 && !isLoadingOrders && (
                                    <tr><td colSpan="4" className="text-center py-4">No pending orders. Great job!</td></tr>
                                )}
                                {isLoadingOrders && (
                                    <tr><td colSpan="4" className="text-center py-4"><span className="loading loading-dots"></span></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}