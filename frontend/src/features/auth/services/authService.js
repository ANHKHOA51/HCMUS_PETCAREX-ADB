import axiosClient from "../../../api/axiosClient";

export const authService = {
  /**
   * Register a new customer
   * @param {Object} data { HoVaTen, SoDienThoai, MatKhau, NgaySinh, DiaChi }
   */
  register: async (data) => {
    const url = "/auth/register";
    return axiosClient.post(url, data);
  },

  /**
   * Login (Customer, Employee, Admin)
   * @param {Object} data { Role, SoDienThoai, MatKhau }
   */
  login: async (data) => {
    const url = "/auth/login";
    return axiosClient.post(url, data);
  },

  /**
   * Logout user (Client-side cleanup)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};
