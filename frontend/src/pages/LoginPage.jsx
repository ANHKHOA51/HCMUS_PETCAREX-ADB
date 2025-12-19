"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authAPI";
import {
  PawPrint,
  Phone,
  Lock,
  User,
  AlertCircle,
  Calendar,
  Home,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    SoDienThoai: "",
    MatKhau: "",
    HoVaTen: "",
    DiaChi: "",
    NgaySinh: "",
    Role: "customer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await authApi.login({
          Role: formData.Role,
          SoDienThoai: formData.SoDienThoai,
          MatKhau: formData.MatKhau,
        });
        const token = `mock_token_${data.user.makhachhang}_${Date.now()}`;
        console.log(data);
        // // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user, role: formData.Role })
        );

        if (data.role === "customer") {
          navigate("/client/dashboard");
        } else if (data.role === "employee") navigate("/doctor/exam");

        // else if (user.Role === "admin") navigate("/admin/dashboard");
      } else {
        console.log(formData);

        const newUser = await authApi.register({
          SoDienThoai: formData.SoDienThoai,
          MatKhau: formData.MatKhau,
          HoVaTen: formData.HoVaTen,
          DiaChi: formData.DiaChi,
          NgaySinh: formData.NgaySinh,
        });

        console.log(newUser);
        const token = `mock_token_${newUser.user.makhachhang}_${Date.now()}`;
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...newUser.user, role: "customer" })
        );

        // Redirect based on Role
        if (newUser.role === "customer") navigate("/client/dashboard");
        else if (newUser.role === "employee") navigate("/doctor/exam");
        // else if (user.Role === "admin") navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                !isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    name="HoVaTen"
                    required
                    value={formData.HoVaTen}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="tel"
                  name="SoDienThoai"
                  required
                  value={formData.SoDienThoai}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    name="NgaySinh"
                    required
                    value={formData.NgaySinh}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your birthday"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    name="DiaChi"
                    required
                    value={formData.DiaChi}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="password"
                  name="MatKhau"
                  required
                  value={formData.MatKhau}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="Role"
                  value={formData.Role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <p>
                <strong>Client:</strong> 0901234567 / client123
              </p>
              <p>
                <strong>Doctor:</strong> 0902345678 / doctor123
              </p>
              <p>
                <strong>Admin:</strong> 0903456789 / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
