import axiosClient from "../../../api/axiosClient";

export const bookingService = {
  createAppointment: (data) => {
    return axiosClient.post("/appointments", data);
  },

  getUserAppointments: async (userId, { limit = 10, cursor = null } = {}) => {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const response = await axiosClient.get(`/appointments/user/${userId}`, { params });
    return response;
  },

  getTodayAppointments: (params = {}) => {
    return axiosClient.get("/appointments/tra-cuu-hen", { params });
  }
};
