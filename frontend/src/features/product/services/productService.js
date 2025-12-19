const API_URL = "/product";

export const productService = {
  getProducts: async ({ search, limit = 10, cursor, type }) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (limit) params.append("limit", limit);
    if (cursor) params.append("cursor", cursor);
    if (type !== undefined && type !== null && type !== "") params.append("type", type);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return await response.json();
  },
};
