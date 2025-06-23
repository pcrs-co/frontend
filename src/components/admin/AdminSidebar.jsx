// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

// Helper for NavLink styling
const navLinkClasses = ({ isActive }) =>
    // Add "text-base" to standardize font size
    `btn ${isActive ? 'btn-active btn-primary' : 'btn-ghost'} w-full justify-start text-base`;

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-base-200 p-4 flex flex-col">
            <h1 className="text-xl font-bold mb-4 px-4">Admin Panel</h1>
            <nav className="flex flex-col gap-2">
                <NavLink to="/admin/dashboard" className={navLinkClasses}>Dashboard</NavLink>
                <NavLink to="/admin/orders" className={navLinkClasses}>Orders</NavLink>
                <NavLink to="/admin/products" className={navLinkClasses}>Products</NavLink>
                <div className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" />
                    {/* Add "text-base font-medium" to match the buttons */}
                    <div className="collapse-title text-base font-medium">
                        Manage Users
                    </div>
                    <div className="collapse-content flex flex-col gap-2 !p-0">
                        <NavLink to="/admin/vendors" className={navLinkClasses}>Vendors</NavLink>
                        <NavLink to="/admin/users" className={navLinkClasses}>Customers</NavLink>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" />
                    {/* Add "text-base font-medium" to match the buttons */}
                    <div className="collapse-title text-base font-medium">
                        AI & Data
                    </div>
                    <div className="collapse-content flex flex-col gap-2 !p-0">
                        <NavLink to="/admin/benchmarks/cpu" className={navLinkClasses}>CPU Benchmarks</NavLink>
                        <NavLink to="/admin/benchmarks/gpu" className={navLinkClasses}>GPU Benchmarks</NavLink>
                    </div>
                </div>
            </nav>
        </aside>
    );
}