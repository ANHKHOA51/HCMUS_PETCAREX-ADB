import axiosClient from "@/api/axiosClient";

export const doctorService = {
  /**
   * Get pets by phone
   * @param {string} phone
   */
  getPetsByPhone: (phone) => {
    return axiosClient.get(`/pet/phone/${phone}`);
  },

  /**
   * Get pet records
   * @param {string} pet_id
   * @param {number} limit
   * @param {number} cursorMaHoSo
   * @param {number} cursorMaLichSuTiem
   */
  getPetRecords: (pet_id, limit = 10, cursorMaHoSo = null, cursorMaLichSuTiem = null) => {
    const params = {
      id: pet_id,
      limit: limit,
    };
    if (cursorMaHoSo) params.cursorMaHoSo = cursorMaHoSo;
    if (cursorMaLichSuTiem) params.cursorMaLichSuTiem = cursorMaLichSuTiem;

    return axiosClient.get("medical/history", {
      params: params,
    });
  },
};
