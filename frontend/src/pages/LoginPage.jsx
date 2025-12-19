import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import LoginForm from "../features/auth/components/LoginForm";
import RegisterForm from "../features/auth/components/RegisterForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Success handler: Navigate based on role
  const handleSuccess = (user) => {
    // Check role and navigate accordingly
    // Assuming user object has 'role' property (lowercase suggested in AuthContext)
    const role = user.role || user.Role || "customer";

    if (role === "customer" || role === "client") {
      navigate("/client/dashboard");
    } else if (role === "employee" || role === "doctor") {
      navigate("/doctor/exam");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      // Default to dashboard if role unclear
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
          <p className="text-gray-600 mt-2">Pet Care Management System</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${!isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                }`}
            >
              Sign Up
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

export default LoginPage;
