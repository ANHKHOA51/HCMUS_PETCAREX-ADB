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
   * @param {string} num
   */
  getPetRecords: (pet_id, num = 10) => {
    return axiosClient.get("medical/history", {
      params: {
        id: pet_id,
        num: num,
      },
    });
  },


};
