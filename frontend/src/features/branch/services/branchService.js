const API_URL = "/branch";

export const branchService = {
  getBranches: async ({ limit = 10, cursor }) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit);
    if (cursor) params.append("cursor", cursor);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch branches");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },
};
