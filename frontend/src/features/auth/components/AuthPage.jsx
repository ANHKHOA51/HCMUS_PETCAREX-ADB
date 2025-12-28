import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import { ROLES } from "../constants/roles";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Success handler: Navigate based on role
  const handleSuccess = (user) => {
    // Normalize user roles to an array
    const roles = Array.isArray(user.roles)
      ? user.roles
      : (user.role || user.Role ? [user.role || user.Role] : [ROLES.CUSTOMER]);

    if (roles.includes(ROLES.ADMIN)) {
      navigate("/admin/dashboard");
    } else if (roles.includes(ROLES.DOCTOR)) {
      navigate("/doctor/pets");
    } else if (roles.includes(ROLES.MANAGER)) {
      navigate("/manager/dashboard");
    } else if (roles.includes(ROLES.RECEPTIONIST)) {
      navigate("/receptionist/dashboard");
    } else {
      navigate("/client/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PETCAREX</h1>
          <p className="text-gray-600 mt-2">Hệ thống quản lý chăm sóc thú cưng</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${!isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                }`}
            >
              Đăng ký
            </button>
          </div>

          {isLogin ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
