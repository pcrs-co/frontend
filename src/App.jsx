import { BrowserRouter as Router, Routes, Route } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/errors/NotFound";
import ForbiddenPage from "./pages/errors/Forbidden";
import AdminLayout from "./components/layout/AdminLayout";
import VendorLayout from "./components/layout/VendorLayout";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Pages */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Public + Fallback */}
          <Route path="*" element={<NotFound />} />


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
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
