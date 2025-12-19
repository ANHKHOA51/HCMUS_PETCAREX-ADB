import { Routes, Route, Navigate } from "react-router-dom";
import { authService } from "../services/authService";

// Pages
import LoginPage from "../pages/LoginPage";
import ClientDashboardPage from "../pages/ClientDashboardPage";
import BookingPage from "../pages/BookingPage";
import DoctorExamPage from "../pages/DoctorExamPage";
import DoctorPrescriptionPage from "../pages/doctor/DoctorPrescriptionPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ProductList from "../features/product/components/ProductList";
import BranchList from "../features/branch/components/BranchList";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Client Routes */}
      <Route
        path="/client/*"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboardPage />} />
        <Route path="dashboard" element={<ClientDashboardPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="products" element={<ProductList />} />
        <Route path="branches" element={<BranchList />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorExamPage />} />
        <Route path="exam" element={<DoctorExamPage />} />
        <Route path="prescription" element={<DoctorPrescriptionPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
