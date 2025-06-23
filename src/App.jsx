import { BrowserRouter as Router, Routes, Route } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LogIn from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/errors/NotFound";
import ForbiddenPage from "./pages/errors/Forbidden";
import HomePage from "./pages/HomePage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorLayout from "./components/layout/VendorLayout";
import VendorListPage from "./pages/admin/vendors/VendorListPage";
import RegisterVendorPage from "./pages/admin/vendors/RegisterVendorPage";
import ProductsPage from "./pages/admin/products/ProductsPage"; // <-- NEW
import OrdersPage from "./pages/admin/orders/OrdersPage";     // <-- NEW
import CustomersPage from "./pages/admin/users/CustomersPage"; // <-- NEW
import CPUBenchmarksPage from "./pages/admin/benchmarks/CPUBenchmarksPage"; // <-- RENAMED
import GPUBenchmarksPage from "./pages/admin/benchmarks/GPUBenchmarksPage"; // <-- NEW

import Layout from "./components/layout/Layout";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Pages */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Public + Fallback */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Layout><Routes><Route index element={<HomePage />} /></Routes></Layout>} />


          {/* Protected Routes */}
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Admin route group */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="vendors">
              <Route index element={<VendorListPage />} />
              <Route path="register" element={<RegisterVendorPage />} />
            </Route>

            {/* New Routes */}
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<CustomersPage />} />
            <Route path="benchmarks">
              <Route path="cpu" element={<CPUBenchmarksPage />} />
              <Route path="gpu" element={<GPUBenchmarksPage />} />
            </Route>

            {/* This makes the dashboard the default page for "/admin" */}
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Vendor route group */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<VendorDashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
