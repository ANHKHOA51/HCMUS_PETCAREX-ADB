import { Routes, Route, Navigate } from "react-router-dom";
import { authService } from "../features/auth/services/authService";

// Pages
import LoginPage from "../pages/LoginPage";
import GuestDashboardPage from "../pages/guest/GuestDashboardPage";
import BookingPage from "../pages/guest/BookingPage";
import ProductPage from "../pages/guest/ProductPage";
import BranchPage from "../pages/guest/BranchPage";
import DoctorExamPage from "../pages/DoctorExamPage";
import DoctorPrescriptionPage from "../pages/doctor/DoctorPrescriptionPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

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
          <ProtectedRoute allowedRoles={["customer"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GuestDashboardPage />} />
        <Route path="dashboard" element={<GuestDashboardPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="branches" element={<BranchPage />} />
        <Route path="booking" element={<BookingPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
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
