import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || "Đã có lỗi xảy ra";
    return Promise.reject(message);
  }
);

export default axiosClient;
