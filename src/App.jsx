// src/App.jsx

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
import ProductsPage from "./pages/admin/products/ProductsPage";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import CustomersPage from "./pages/admin/users/CustomersPage";
import CPUBenchmarksPage from "./pages/admin/benchmarks/CPUBenchmarksPage";
import GPUBenchmarksPage from "./pages/admin/benchmarks/GPUBenchmarksPage";
import DiskBenchmarksPage from "./pages/admin/benchmarks/DiskBenchmarksPage";
import VendorDetailPage from "./pages/admin/vendors/VendorDetailPage";
import ProductDetailPage from "./pages/admin/products/ProductDetailPage";
import OrderDetailPage from "./pages/admin/orders/OrderDetailPage";
import CustomerDetailPage from "./pages/admin/users/CustomerDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import RecommenderPage from "./pages/RecommenderPage";
import Results from "./pages/Results";
import Layout from "./Layout";

// +++ 1. IMPORT THE NEW VENDOR PAGES +++
// Make sure you have created these files:
// - src/pages/vendor/ProductsPage.jsx
// - src/pages/vendor/OrdersPage.jsx
import VendorProductsPage from "./pages/vendor/ProductsPage";
import VendorOrdersPage from "./pages/vendor/OrdersPage";
// +++ END OF NEW IMPORTS +++

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
          <Route path="/results" element={<Layout><Routes><Route index element={<Results />} /></Routes></Layout>} />


          {/* Protected Routes */}
          <Route path="/403" element={<ForbiddenPage />} />

          {/* --- Protected Profile Route --- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

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
              <Route path=":vendorId" element={<VendorDetailPage />} />
            </Route>
            <Route path="products">
              <Route index element={<ProductsPage />} />
              <Route path=":productId" element={<ProductDetailPage />} />
            </Route>
            <Route path="orders">
              <Route index element={<OrdersPage />} />
              <Route path=":orderId" element={<OrderDetailPage />} />
            </Route>
            <Route path="users">
              <Route index element={<CustomersPage />} />
              <Route path=":userId" element={<CustomerDetailPage />} />
            </Route>
            <Route path="benchmarks">
              <Route path="cpu" element={<CPUBenchmarksPage />} />
              <Route path="gpu" element={<GPUBenchmarksPage />} />
              <Route path="disk" element={<DiskBenchmarksPage />} />
            </Route>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* +++ 2. UPDATE THE VENDOR ROUTE GROUP +++ */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            {/* The index route makes /vendor load the dashboard by default */}
            <Route index element={<VendorDashboard />} />
            <Route path="dashboard" element={<VendorDashboard />} />
            {/* These are the new routes for the vendor's own pages */}
            <Route path="products" element={<VendorProductsPage />} />
            <Route path="orders" element={<VendorOrdersPage />} />
          </Route>
          {/* +++ END OF VENDOR ROUTE GROUP UPDATE +++ */}

        </Routes>
      </Router>
    </>
  );
}

export default App;