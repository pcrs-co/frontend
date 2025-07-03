// src/components/layout/VendorSidebar.jsx
import { NavLink } from "react-router-dom";
import { ChartPieIcon, ShoppingBagIcon, InboxIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../utils/hooks/useAuth';

const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
    }`;

export default function VendorSidebar() {
    const { logout, user } = useAuth();
    
    return (
        <aside className="w-64 bg-base-200 p-4 flex flex-col h-screen sticky top-0">
            <div className="p-4 mb-4">
                <h1 className="text-xl font-bold text-center">{user?.vendor_profile?.company_name || 'Vendor Panel'}</h1>
            </div>
            <nav className="flex flex-col gap-2 flex-grow">
                <NavLink to="/vendor/dashboard" className={navLinkClasses}>
                    <ChartPieIcon className="h-6 w-6" />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/vendor/products" className={navLinkClasses}>
                    <ShoppingBagIcon className="h-6 w-6" />
                    <span>My Products</span>
                </NavLink>
                <NavLink to="/vendor/orders" className={navLinkClasses}>
                    <InboxIcon className="h-6 w-6" />
                    <span>Customer Orders</span>
                </NavLink>
            </nav>
            <div className="mt-auto">
                 <button onClick={logout} className="btn btn-ghost w-full justify-start gap-3">
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}