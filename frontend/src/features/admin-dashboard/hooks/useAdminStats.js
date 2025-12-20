import { useState, useCallback } from "react";
import { statsService } from "../services/statsService";

export const useAdminStats = () => {
  const [totalRevenue, setTotalRevenue] = useState({
    value: 0,
    loading: false,
    error: ""
  });

  const [revenueTrend, setRevenueTrend] = useState({
    data: [],
    loading: false,
    error: ""
  });

  const [serviceDistribution, setServiceDistribution] = useState({
    data: [],
    loading: false,
    error: ""
  });

  const [branchPerformance, setBranchPerformance] = useState({
    data: [],
    loading: false,
    error: ""
  });

  const [serviceRevenueByBranch, setServiceRevenueByBranch] = useState({
    data: [],
    services: [],
    loading: false,
    error: ""
  });

  const fetchTotalRevenue = useCallback(async (startDate, endDate) => {
    setTotalRevenue(prev => ({ ...prev, loading: true, error: "" }));
    try {
      const data = await statsService.fetchTotalRevenue(startDate, endDate);
      console.log(data)
      setTotalRevenue({
        value: Number(data[0]?.TongDoanhThu ?? 0),
        loading: false,
        error: ""
      });
    } catch (err) {
      setTotalRevenue(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  const fetchRevenueTrend = useCallback(async (startDate, endDate) => {
    setRevenueTrend(prev => ({ ...prev, loading: true, error: "" }));
    try {
      const data = await statsService.fetchRevenueTrend(startDate, endDate);
      const chartData = data.map(item => ({
        month: item.month,
        revenue: Number(item.totalRevenue || 0),
      }));
      setRevenueTrend({ data: chartData, loading: false, error: "" });
    } catch (err) {
      setRevenueTrend(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  const fetchServiceDistribution = useCallback(async (startDate, endDate) => {
    setServiceDistribution(prev => ({ ...prev, loading: true, error: "" }));
    try {
      const rawData = await statsService.fetchServiceDistribution(startDate, endDate);
      const data = Array.isArray(rawData) ? rawData : [];

      const revenueByService = data.reduce((acc, item) => {
        const serviceName = item["Tên dịch vụ"] || "Khác";
        const revenue = Number(item["Doanh thu"] || 0);
        acc[serviceName] = (acc[serviceName] || 0) + revenue;
        return acc;
      }, {});

      const totalRevenue = Object.values(revenueByService).reduce((sum, val) => sum + val, 0);
      const chartData = Object.entries(revenueByService).map(([name, value], index) => {
        const percentage = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
        return {
          name,
          value: parseFloat(percentage.toFixed(2)),
          // Colors will be handled in component or passed here if needed
        };
      });

      setServiceDistribution({ data: chartData, loading: false, error: "" });
    } catch (err) {
      setServiceDistribution(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  const fetchBranchPerformance = useCallback(async (startDate, endDate) => {
    setBranchPerformance(prev => ({ ...prev, loading: true, error: "" }));
    try {
      const rawData = await statsService.fetchBranchRevenue(startDate, endDate);
      const data = rawData.map(item => ({
        branch: item["Tên chi nhánh"],
        revenue: Number(item["Tổng doanh thu"] || 0),
      }));

      const sortedBranchData = data.slice().sort((a, b) => {
        const numA = parseInt(a.branch.replace(/[^\d]/g, ""), 10) || 0;
        const numB = parseInt(b.branch.replace(/[^\d]/g, ""), 10) || 0;
        return numA - numB;
      });

      setBranchPerformance({ data: sortedBranchData, loading: false, error: "" });
    } catch (err) {
      setBranchPerformance(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  const fetchServiceRevenueByBranch = useCallback(async (startDate, endDate) => {
    setServiceRevenueByBranch(prev => ({ ...prev, loading: true, error: "" }));
    try {
      const rawData = await statsService.fetchServiceRevenueByBranch(startDate, endDate);
      const data = Array.isArray(rawData) ? rawData : [];

      const grouped = data.reduce((acc, item) => {
        const branch = item["Tên chi nhánh"];
        const service = item["Tên dịch vụ"];
        const revenue = Number(item["Doanh thu"] || 0);

        if (!acc[branch]) {
          acc[branch] = { name: branch };
        }
        acc[branch][service] = (acc[branch][service] || 0) + revenue;
        return acc;
      }, {});

      const allServices = [...new Set(data.map(item => item["Tên dịch vụ"]))];

      const finalData = Object.values(grouped).sort((a, b) => {
        const numA = parseInt(a.name.replace(/[^\d]/g, ""), 10) || 0;
        const numB = parseInt(b.name.replace(/[^\d]/g, ""), 10) || 0;
        return numA - numB;
      });

      setServiceRevenueByBranch({
        data: finalData,
        services: allServices,
        loading: false,
        error: ""
      });
    } catch (err) {
      setServiceRevenueByBranch(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  return {
    totalRevenue,
    fetchTotalRevenue,
    revenueTrend,
    fetchRevenueTrend,
    serviceDistribution,
    fetchServiceDistribution,
    branchPerformance,
    fetchBranchPerformance,
    serviceRevenueByBranch,
    fetchServiceRevenueByBranch
  };
};
