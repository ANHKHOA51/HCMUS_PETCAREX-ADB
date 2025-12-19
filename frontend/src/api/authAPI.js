import axiosClient from "./axiosClient";

const authApi = {
  /**
   * Đăng ký khách hàng
   * @param {Object} data { HoVaTen, SoDienThoai, MatKhau, NgaySinh, DiaChi }
   */
  register: (data) => {
    const url = "/auth/register";
    console.log("hello");
    return axiosClient.post(url, data);
  },

  /**
   * Đăng nhập (Khách hàng hoặc Nhân viên)
   * @param {Object} data { Role, SoDienThoai, MatKhau }
   */
  login: (data) => {
    const url = "/auth/login";
    return axiosClient.post(url, data);
  },
};

export default authApi;
