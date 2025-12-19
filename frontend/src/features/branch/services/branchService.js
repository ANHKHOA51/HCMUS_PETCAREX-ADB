import axiosClient from "../../../api/axiosClient";

const API_URL = "/branch";

export const branchService = {
  getBranches: ({ limit = 10, cursor }) => {
    const params = {
      limit,
      cursor,
    };
    return axiosClient.get(API_URL, { params });
  },
};
