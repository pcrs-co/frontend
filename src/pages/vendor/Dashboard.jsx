// src/pages/vendor/Dashboard.jsx
import React from 'react';
import { useVendorProducts } from '../../utils/hooks/useVendorProducts';
import { useOrdersList } from '../../utils/hooks/useOrders';
import StatCard from '../../components/admin/dashboard/StatCard'; // We can reuse this!
import { ShoppingBagIcon, InboxIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
    const { products, isLoading: isLoadingProducts } = useVendorProducts();
    const { data: ordersResponse, isLoading: isLoadingOrders } = useOrdersList();
    
    const allOrders = ordersResponse?.results || ordersResponse || [];

    const productCount = products?.length || 0;
    const pendingOrders = allOrders.filter(o => o.status === 'pending');
    const confirmedOrders = allOrders.filter(o => o.status === 'confirmed');

    const totalRevenue = confirmedOrders.reduce((sum, order) => {
        const price = parseFloat(order.product?.price || 0);
        return sum + (order.quantity * price);
    }, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            
            {/* --- Stat Cards --- */}
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
            
            {/* --- Recent Pending Orders Table --- */}
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
                                {pendingOrders.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-4">No pending orders. Great job!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}