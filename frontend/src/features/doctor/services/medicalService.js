import axiosClient from "@/api/axiosClient";

export const medicalService = {
  getMedicines: async ({ search, limit, cursor, type } = {}) => {
    const response = await axiosClient.get("/product", {
      params: {
        search,
        limit,
        cursor,
        type,
      },
    });
    return response;
  },
};
