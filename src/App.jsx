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
import VendorDetailPage from "./pages/admin/vendors/VendorDetailPage"; // <-- NEW
import ProductDetailPage from "./pages/admin/products/ProductDetailPage"; // <-- NEW
import OrderDetailPage from "./pages/admin/orders/OrderDetailPage"; // <-- NEW
import CustomerDetailPage from "./pages/admin/users/CustomerDetailPage"; // <-- NEW
import UserProfilePage from "./pages/UserProfilePage";

import Results from "./pages/Results"
import Layout from "./Layout";
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
              <Route path=":vendorId" element={<VendorDetailPage />} /> {/* <-- NEW */}
            </Route>

            {/* New Routes */}
            <Route path="products">
              <Route index element={<ProductsPage />} />
              <Route path=":productId" element={<ProductDetailPage />} /> {/* <-- NEW */}
            </Route>

            <Route path="orders">
              <Route index element={<OrdersPage />} />
              <Route path=":orderId" element={<OrderDetailPage />} /> {/* <-- NEW */}
            </Route>

            <Route path="users">
              <Route index element={<CustomersPage />} />
              <Route path=":userId" element={<CustomerDetailPage />} /> {/* <-- NEW ROUTE */}
            </Route>

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
