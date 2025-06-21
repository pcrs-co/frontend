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
import Layout from "./components/layout/Layout";
import ResultsPage from './pages/ResultsPage';
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
          <Route path="/" element={<Layout><Routes><Route index element={<HomePage />} /><Route path="results" element={<ResultsPage />} /></Routes></Layout>} />


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
