import axios from "axios";

// Base URL - ideally this should be from an environment variable or a configured axios instance
const BASE_URL = "http://localhost:3000/report";

export const statsService = {
  fetchTotalRevenue: async (startDate, endDate) => {
    const response = await axios.get(`${ BASE_URL }/revenue/total`, {
      params: { NgayBatDau: startDate, NgayKetThuc: endDate },
    });
    return response.data;
  },

  fetchRevenueTrend: async (startDate, endDate) => {
    // Note: Endpoint /revenue/trend needs to be implemented in backend
    const response = await axios.get(`${ BASE_URL }/revenue/trend`, {
      params: { NgayBatDau: startDate, NgayKetThuc: endDate },
    });
    return response.data;
  },

  fetchServiceDistribution: async (startDate, endDate) => {
    const response = await axios.get(`${ BASE_URL }/revenue/service`, {
      params: { NgayBatDau: startDate, NgayKetThuc: endDate },
    });
    return response.data;
  },

  fetchBranchRevenue: async (startDate, endDate) => {
    const response = await axios.get(`${ BASE_URL }/revenue/branch`, {
      params: { NgayBatDau: startDate, NgayKetThuc: endDate },
    });
    return response.data;
  },
  
  // Reusing the same endpoint for grouped view as per original code
  fetchServiceRevenueByBranch: async (startDate, endDate) => {
    const response = await axios.get(`${ BASE_URL }/revenue/service`, {
        params: { NgayBatDau: startDate, NgayKetThuc: endDate },
      });
      return response.data;
  }
};
