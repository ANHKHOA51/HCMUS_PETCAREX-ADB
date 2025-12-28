import React, { useState, useEffect } from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import TotalRevenueCard from './TotalRevenueCard';
import ExaminationCountCard from './ExaminationCountCard';
import RevenueTrendChart from './RevenueTrendChart';
import ServiceDistributionChart from './ServiceDistributionChart';
import BranchPerformanceChart from './BranchPerformanceChart';
import ServiceRevenueByBranchChart from './ServiceRevenueByBranchChart';
import DateFilter from './DateFilter';

const AdminDashboard = () => {
  const stats = useAdminStats();
  const [dates, setDates] = useState({
    startDate: "2025-01-01",
    endDate: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (field, value) => {
    setDates(prev => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    if (new Date(dates.startDate) > new Date(dates.endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }
    // Fetch all stats
    stats.fetchTotalRevenue(dates.startDate, dates.endDate);
    stats.fetchExaminationCount(dates.startDate, dates.endDate);
    stats.fetchRevenueTrend(dates.startDate, dates.endDate);
    stats.fetchServiceDistribution(dates.startDate, dates.endDate);
    stats.fetchBranchPerformance(dates.startDate, dates.endDate);
    stats.fetchServiceRevenueByBranch(dates.startDate, dates.endDate);
  };

  // Initial fetch on mount
  useEffect(() => {
    handleFilter();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Date Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển quản trị</h1>
            <p className="text-gray-600">Tổng quan về hiệu suất và phân tích của PETCAREX</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
            <span className="text-sm font-medium text-gray-700">Lọc theo ngày:</span>
            <DateFilter
              startDate={dates.startDate}
              endDate={dates.endDate}
              onChange={handleChange}
            />
            <button
              onClick={handleFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TotalRevenueCard
            data={stats.totalRevenue}
            loading={stats.totalRevenue.loading}
          />
          <ExaminationCountCard
            data={stats.examinationCount}
            loading={stats.examinationCount.loading}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueTrendChart
            data={stats.revenueTrend}
            loading={stats.revenueTrend.loading}
          />

          <ServiceDistributionChart
            data={stats.serviceDistribution}
            loading={stats.serviceDistribution.loading}
          />
        </div>

        {/* Charts Row 2 */}
        <BranchPerformanceChart
          data={stats.branchPerformance}
          loading={stats.branchPerformance.loading}
        />

        {/* <div className="mt-6">
          <ServiceRevenueByBranchChart
            data={stats.serviceRevenueByBranch}
            loading={stats.serviceRevenueByBranch.loading}
          />
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
