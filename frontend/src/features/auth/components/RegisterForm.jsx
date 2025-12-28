import { useState } from "react";
import { User, Phone, Lock, Calendar, Home, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    SoDienThoai: "",
    MatKhau: "",
    HoVaTen: "",
    DiaChi: "",
    NgaySinh: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(formData);
      if (onSuccess) onSuccess(user);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Họ và tên
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
            placeholder="Nhập họ và tên"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Số điện thoại
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
            placeholder="Nhập số điện thoại"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ngày sinh
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
            placeholder="Nhập ngày sinh"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Địa chỉ
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
            placeholder="Nhập địa chỉ"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mật khẩu
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
            placeholder="Nhập mật khẩu"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Đang xử lý..." : "Đăng ký"}
      </button>
    </form>
  );
};

export default RegisterForm;
