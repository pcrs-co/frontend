<<<<<<< HEAD
// src/components/layout/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminHeader from "../admin/AdminHeader";
import AdminSidebar from "../admin/AdminSidebar";
=======
import { Link, Outlet } from "react-router-dom";
>>>>>>> 54e7565708e91e568510113fb39473993b346f02

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-base-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}