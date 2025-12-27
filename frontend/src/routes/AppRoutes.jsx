import { Routes, Route, Navigate } from "react-router-dom";
import { authService } from "../features/auth/services/authService";
import { ROLES } from "../features/auth/constants/roles";

// Pages
import LoginPage from "../pages/LoginPage";
import GuestDashboardPage from "../pages/guest/GuestDashboardPage";
import BookingPage from "../pages/guest/BookingPage";
import ProductPage from "../pages/guest/ProductPage";
import BranchPage from "../pages/guest/BranchPage";
import DoctorExamPage from "../pages/doctor/DoctorExamPage";
import DoctorPrescriptionPage from "../pages/doctor/DoctorPrescriptionPage";
import ManagerDashboardPage from "../pages/manager/ManagerDashboardPage";
import ReceptionistDashboardPage from "../pages/receptionist/ReceptionistDashboardPage";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Normalize user roles to an array
  const userRoles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
    ? [user.role]
    : [];

  // Normalize allowedRoles to an array
  const requiredRoles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  // Check if user has at least one of the required roles
  const hasPermission =
    requiredRoles.length === 0 ||
    requiredRoles.some((role) => userRoles.includes(role));

  if (!hasPermission) {
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
          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
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

      {/* Staff Routes */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorExamPage />} />
        <Route path="pets" element={<DoctorExamPage />} />
        <Route path="prescription" element={<DoctorPrescriptionPage />} />
      </Route>

      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboardPage />} />
        <Route path="dashboard" element={<ManagerDashboardPage />} />
      </Route>

      {/* Receptionist Routes */}
      <Route
        path="/receptionist/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReceptionistDashboardPage />} />
        <Route path="dashboard" element={<ReceptionistDashboardPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
