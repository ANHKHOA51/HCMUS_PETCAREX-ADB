import { useState } from "react";
import { User, Lock, AlertCircle } from "lucide-react";
import { useNavigation } from "react-router-dom"; // Actually used in LoginPage, but here we might just return success or use internal logic? 
// Wait, parent component handles switch mode, but this component handles submission.
// We should accept onSuccess prop or handle navigation here? 
// The plan said "Handle navigation after success" in LoginPage.jsx if possible, 
// OR we can do it here. 
// Let's pass 'onSuccess' callback or use navigate inside.
// Actually context handles storage. Navigation is UI concern. Let's keep navigation close to the form or parent?
// Standard feature pattern: Form handles data -> success -> callback -> parent navigates.
// Or Form handles everything.
// Given LoginPage logic: "if customer navigate dashboard", "if employee navigate exam".
// This logic is best kept in the hook or the form submit handler.
// Ideally, the form should just call `login` from context.

import { useAuth } from "../hooks/useAuth";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    SoDienThoai: "",
    MatKhau: "",
    Role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData);
      if (onSuccess) onSuccess(user);
    } catch (err) {
      setError(err.message || "Login failed");
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
          Phone Number
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
};

// Start: Helper Icon (Phone was missing in imports)
import { Phone as PhoneIcon } from "lucide-react";

export default LoginForm;
