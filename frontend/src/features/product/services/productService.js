import axiosClient from "../../../api/axiosClient";

const API_URL = "/product";

export const productService = {
  getProducts: ({ search, limit = 10, cursor, type }) => {
    const params = {
      limit,
      cursor,
    };
    if (search) params.search = search;
    if (type !== undefined && type !== null && type !== "") params.type = type;

    return axiosClient.get(API_URL, { params });
  },

  getProductById: (id) => {
    return axiosClient.get(`${API_URL}/${id}`);
  },
};
