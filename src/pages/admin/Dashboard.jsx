// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useAdminResourceList } from '../../utils/hooks/useAdminResourceList';
import { useOrdersList } from '../../utils/hooks/useOrders';
import { useAuth } from '../../utils/hooks/useAuth';

// Import our new dashboard components
import StatCard from '../../components/admin/dashboard/StatCard';
import OrderStatusChart from '../../components/admin/dashboard/OrderStatusChart';
import RecentActivityTable from '../../components/admin/dashboard/RecentActivityTable';

// Import icons (you already have these!)
import { UserGroupIcon, CubeTransparentIcon, CurrencyDollarIcon, QueueListIcon, CpuChipIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    // --- 1. Fetch data for all sections ---
    const { user } = useAuth(); // Get admin's name
    const { data: vendorsData, isLoading: isLoadingVendors } = useAdminResourceList('vendors');
    const { data: customersData, isLoading: isLoadingCustomers } = useAdminResourceList('customers');
    const { data: productsData, isLoading: isLoadingProducts } = useAdminResourceList('products');
    const { data: ordersData, isLoading: isLoadingOrders } = useOrdersList();

    // --- 2. Safely extract counts and recent items ---
    const vendorCount = vendorsData?.count ?? 0;
    const customerCount = customersData?.count ?? 0;
    const productCount = productsData?.count ?? 0;

    const allOrders = ordersData?.results || ordersData || [];
    const recentOrders = allOrders.slice(0, 5);
    const pendingOrderCount = allOrders.filter(o => o.status === 'pending').length;

    const totalRevenue = allOrders
        .filter(o => o.status === 'confirmed' && o.product?.price)
        .reduce((sum, order) => sum + (order.quantity * parseFloat(order.product.price)), 0);
    
    // --- 3. Define table structures ---
    const orderColumns = [
        { header: 'Order ID', accessor: 'id', render: (item) => <Link to={`/admin/orders/${item.id}`} className="link link-hover font-mono">#{item.id}</Link> },
        { header: 'Customer', accessor: 'user.email' },
        { header: 'Status', accessor: 'status', render: (item) => <span className={`badge badge-sm ${
            item.status === 'pending' ? 'badge-warning' : item.status === 'confirmed' ? 'badge-success' : 'badge-error'
        }`}>{item.status}</span> },
    ];
    
    const customerColumns = [
        { header: 'Username', accessor: 'username', render: (item) => <Link to={`/admin/users/${item.id}`} className="link link-hover">@{item.username}</Link> },
        { header: 'Email', accessor: 'email'},
        { header: 'Joined', accessor: 'date_joined', render: (item) => new Date(item.date_joined).toLocaleDateString() },
    ];

    // --- 4. Render the UI ---
    return (
        <div className="p-4 md:p-6 bg-base-200 min-h-screen space-y-6">
            {/* Header */}
            <div className="text-base-content">
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {user?.first_name || user?.username}!</h1>
                <p className="text-lg opacity-80">Here's a snapshot of your platform's activity.</p>
            </div>
            
            {/* --- Stat Cards Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<CurrencyDollarIcon className="h-8 w-8"/>}
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                    description="From confirmed orders"
                    isLoading={isLoadingOrders}
                />
                <StatCard 
                    icon={<QueueListIcon className="h-8 w-8"/>}
                    title="Pending Orders"
                    value={pendingOrderCount}
                    description={`${allOrders.length} total orders`}
                    isLoading={isLoadingOrders}
                    linkTo="/admin/orders"
                />
                <StatCard 
                    icon={<UserGroupIcon className="h-8 w-8"/>}
                    title="Total Customers"
                    value={customerCount}
                    description="Registered users"
                    isLoading={isLoadingCustomers}
                    linkTo="/admin/users"
                />
                <StatCard 
                    icon={<ShoppingBagIcon className="h-8 w-8"/>}
                    title="Registered Vendors"
                    value={vendorCount}
                    description="Verified partners"
                    isLoading={isLoadingVendors}
                    linkTo="/admin/vendors"
                />
            </div>
            
            {/* --- Main Content Section (Charts & Recent Activity) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <OrderStatusChart orders={allOrders} isLoading={isLoadingOrders} />
                </div>
                <div className="flex flex-col gap-6">
                    <RecentActivityTable
                        title="Recent Orders"
                        items={recentOrders}
                        columns={orderColumns}
                        linkToBase="/admin/orders"
                        isLoading={isLoadingOrders}
                    />
                    <RecentActivityTable
                        title="New Customers"
                        items={(customersData?.results || []).slice(0, 5)}
                        columns={customerColumns}
                        linkToBase="/admin/users"
                        isLoading={isLoadingCustomers}
                    />
                </div>
            </div>

             {/* --- Quick Access Section --- */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/products" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="card-body flex-row items-center gap-4">
                        <CubeTransparentIcon className="h-12 w-12 text-primary"/>
                        <div>
                            <h2 className="card-title">Manage Products</h2>
                            <p>View and manage all product listings.</p>
                        </div>
                    </div>
                </Link>
                <Link to="/admin/vendors/register" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="card-body flex-row items-center gap-4">
                        <ShoppingBagIcon className="h-12 w-12 text-secondary"/>
                        <div>
                            <h2 className="card-title">Register Vendor</h2>
                            <p>Onboard a new sales partner.</p>
                        </div>
                    </div>
                </Link>
                <Link to="/admin/benchmarks/cpu" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="card-body flex-row items-center gap-4">
                        <CpuChipIcon className="h-12 w-12 text-accent"/>
                        <div>
                            <h2 className="card-title">AI & Data</h2>
                            <p>Update CPU/GPU benchmark data.</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}