import axiosClient from "../../../api/axiosClient";

export const clientService = {
  /**
   * Get pets by User ID
   * @param {string} userId
   */
  getPetsByUserId: (userId) => {
    return axiosClient.get(`/pet/user/${userId}`);
  },

  /**
   * Get pets by Phone Number (using Stored Procedure)
   * @param {string} phone
   */
  getPetsByPhone: (phone) => {
    return axiosClient.get(`/pet/phone/${phone}`);
  },

  /**
   * Create a new pet
   * @param {Object} petData 
   */
  createPet: (petData) => {
    return axiosClient.post("/pet", petData);
  },

  /**
   * Update a pet
   * @param {string} id 
   * @param {Object} petData 
   */
  updatePet: (id, petData) => {
    console.log(petData)
    return axiosClient.put(`/pet/${id}`, petData);
  },

  /**
   * Delete a pet
   * @param {string} id 
   */
  deletePet: (id) => {
    return axiosClient.delete(`/pet/${id}`);
  }
};
