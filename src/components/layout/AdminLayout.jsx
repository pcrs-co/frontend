// src/components/AdminDashboardLayout.jsx
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/admin/vendors">Vendors</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/benchmarks">Benchmarks</Link>
          <Link to="/admin/products">Products</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-base-100">
        <Outlet />
      </main>
    </div>
  );
}
