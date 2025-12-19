import axiosClient from "./axiosClient";

const cusAPI = {
  /**
   * Get pets by User ID
   * @param {string} userId
   */
  getPetsByUserId: (userId) => {
    const url = `/pet/user/${userId}`;
    return axiosClient.get(url);
  },

  /**
   * Get pets by Phone Number (using Stored Procedure)
   * @param {string} phone
   */
  getPetsByPhone: (phone) => {
    const url = `/pet/phone/${phone}`;
    return axiosClient.get(url);
  },
};

export default cusAPI;
