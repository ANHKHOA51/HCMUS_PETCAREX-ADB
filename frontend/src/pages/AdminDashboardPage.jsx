"use client"
import { useEffect, useState } from "react";
import axios from "axios";

//import { useState } from "react"
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Colors for service distribution pie chart
const SERVICE_COLORS = [
  //"#3b82f6",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  //"#ef4444",
];


// const branchData = [
//   { branch: "District 1", revenue: 180000000, patients: 450 },
//   { branch: "District 3", revenue: 165000000, patients: 420 },
//   { branch: "District 5", revenue: 142000000, patients: 380 },
//   { branch: "District 7", revenue: 158000000, patients: 410 },
// ]

// DateFilter Component
const DateFilter = ({ startDate, endDate, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="date"
      value={startDate}
      onChange={(e) => onChange("startDate", e.target.value)}
      className="
        h-[40px]
        w-[110px]
        px-3
        text-sm
        border
        rounded-lg
        appearance-none
        leading-none
        focus:ring-2 focus:ring-blue-500
        outline-none
      "
    />

    <input
      type="date"
      value={endDate}
      onChange={(e) => onChange("endDate", e.target.value)}
      className="
        h-[40px]
        w-[110px]
        px-3
        text-sm
        border
        rounded-lg
        appearance-none
        leading-none
        focus:ring-2 focus:ring-blue-500
        outline-none
      "
    />
  </div>
);

const AdminDashboardPage = () => {
  

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "VND";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  // ===== TOTAL REVENUE CARD STATE =====
  const [revenueCard, setRevenueCard] = useState({
    startDate: "2025-01-01",
    endDate: new Date().toISOString().slice(0, 10),
    value: 0,
    error: "",
    loading: false,
  });

  // ===== SERVICE DISTRIBUTION STATE =====
const [serviceCard, setServiceCard] = useState({
  startDate: "2025-01-01",
  endDate: new Date().toISOString().slice(0, 10),
  data: [],
  error: "",
  loading: false,
});

// ===== REVENUE TREND STATE =====
const [revenueTrendCard, setRevenueTrendCard] = useState({
  startDate: "2025-01-01",
  endDate: new Date().toISOString().slice(0, 10),
  loading: false,
  error: "",
});

// ===== BRANCH PERFORMANCE STATE =====
const [branchFilter, setBranchFilter] = useState({
  startDate: "2025-01-01",
  endDate: new Date().toISOString().slice(0,10),
  data: [],
  loading: false,
  error: ""
});
// ===== GROUP DATA STATE =====
const [groupDataFilter, setGroupDataFilter] = useState({
  startDate: "2025-01-01",
  endDate: new Date().toISOString().slice(0, 10),
  data: [],
  services: [], // Để lưu danh sách các dịch vụ duy nhất nhằm vẽ cột
  loading: false
});

// ===== FETCH REVENUE TREND =====
const fetchRevenueTrend = async () => {
  if (new Date(revenueTrendCard.startDate) > new Date(revenueTrendCard.endDate)) {
    alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
    return;
  }

  setRevenueTrendCard(prev => ({ ...prev, loading: true, error: "" }));

  try {
    const res = await axios.get(
      "http://localhost:3000/procedure/bao-cao/doanh-thu-theo-thang",
      {
        params: {
          NgayBatDau: revenueTrendCard.startDate,
          NgayKetThuc: revenueTrendCard.endDate,
        },
      }
    );

    const chartData = res.data.map(item => ({
        month: item.month,
        revenue: Number(item.totalRevenue || 0),
      }))
    console.log("CHART DATA:", chartData);
    setRevenueTrendCard(prev => ({ ...prev, data: chartData }));
  } catch (err) {
    console.error("Error fetching revenue trend:", err);
    setRevenueTrendCard(prev => ({ ...prev, error: "Lỗi khi lấy dữ liệu" }));
  } finally {
    setRevenueTrendCard(prev => ({ ...prev, loading: false }));
  }
};

  // ===== FETCH DATA EFFECT =====
  const fetchRevenue = async () => {
    console.log("Filter:", revenueCard.startDate, revenueCard.endDate);
    if (new Date(revenueCard.startDate) > new Date(revenueCard.endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }
    setRevenueCard(prev => ({ ...prev, error: ""}));
    try {
      setRevenueCard(prev => ({ ...prev, loading: true }));

      const res = await axios.get(
        "http://localhost:3000/procedure/bao-cao/tong-doanh-thu",
        {
          params: {
            NgayBatDau: revenueCard.startDate,
            NgayKetThuc: revenueCard.endDate,
          },
        }
      );
      setRevenueCard(prev => ({
        ...prev,
        value: Number(res.data?.TongDoanhThu ?? 0),
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      setRevenueCard(prev => ({ ...prev, loading: false }));
    }
  };

  
  const fetchServiceDistribution = async () => {
    if (new Date(serviceCard.startDate) > new Date(serviceCard.endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    setServiceCard(prev => ({ ...prev, error: "", loading: true }));

    try {
      const res = await axios.get(
        "http://localhost:3000/procedure/bao-cao/doanh-thu-dich-vu",
        {
          params: {
            NgayBatDau: serviceCard.startDate,
            NgayKetThuc: serviceCard.endDate,
          },
        }
      );

      const rawData = Array.isArray(res.data) ? res.data : [];
      console.log("1. RAW DATA FROM SQL:");
      console.table(rawData);
      // Bước 1: Gộp doanh thu theo từng dịch vụ
      const revenueByService = rawData.reduce((acc, item) => {
        const serviceName = item["Tên dịch vụ"] || "Khác";
        const revenue = Number(item["Doanh thu"] || 0);
        acc[serviceName] = (acc[serviceName] || 0) + revenue;
        return acc;
      }, {});
      console.log("2. GROUPED REVENUE (MAP):", revenueByService);

      // Bước 2: Tính tổng doanh thu toàn bộ (Grand Total)
      const totalRevenue = Object.values(revenueByService).reduce((sum, val) => sum + val, 0);
      console.log(`3. TOTAL REVENUE: ${totalRevenue.toLocaleString()} VND`);
      // Bước 3: Chuyển thành mảng chứa phần trăm
      const chartData = Object.entries(revenueByService).map(([name, value], index) => {
        // Tính phần trăm (tránh chia cho 0)
        const percentage = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
        
        return {
          name,
          value: parseFloat(percentage.toFixed(2)), // Làm tròn 2 chữ số thập phân
          color: SERVICE_COLORS[index % SERVICE_COLORS.length],
        };
      });

      console.log("CHART DATA (PERCENTAGE):", chartData);

      setServiceCard(prev => ({
        ...prev,
        data: chartData,
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      setServiceCard(prev => ({ ...prev, loading: false }));
    }
};



  //FETCH BRANCH DATA
  const fetchBranchData = async () => {
    if (new Date(branchFilter.startDate) > new Date(branchFilter.endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    try {
      setBranchFilter(prev => ({ ...prev, loading: true }));

      const res = await axios.get("http://localhost:3000/procedure/bao-cao/doanh-thu-chi-nhanh", {
        params: {
          NgayBatDau: branchFilter.startDate,
          NgayKetThuc: branchFilter.endDate
        }
      });
      
      const data = res.data.map(item => ({
        branch: item.branchName, 
        revenue: Number(item.totalRevenue || 0),
      }));

      const sortedBranchData = data.slice().sort((a, b) => {
        const numA = parseInt(a.branch.replace(/[^\d]/g, ""), 10);
        const numB = parseInt(b.branch.replace(/[^\d]/g, ""), 10);
        return numA - numB;
      });


      setBranchFilter(prev => ({ ...prev, data: sortedBranchData, loading: false }));
      

      console.log("Branch Data:", data); // kiểm tra dữ liệu
    } catch (err) {
      console.error("Error fetching branch data:", err);
      setBranchFilter(prev => ({ ...prev, loading: false }));
    }
  };
  //FETCH GROUPED DATA
  const fetchGroupedData = async () => {
    if (new Date(groupDataFilter.startDate) > new Date(groupDataFilter.endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    setGroupDataFilter(prev => ({ ...prev, loading: true }));

    try {
      const res = await axios.get("http://localhost:3000/procedure/bao-cao/doanh-thu-dich-vu", {
        params: {
          NgayBatDau: groupDataFilter.startDate,
          NgayKetThuc: groupDataFilter.endDate
        }
      });

      const rawData = Array.isArray(res.data) ? res.data : [];
      console.log("Raw Data for Grouped:", rawData);
      // Bước 1: Dùng Map để nhóm dữ liệu theo Chi Nhánh
      const grouped = rawData.reduce((acc, item) => {
        const branch = item["Tên chi nhánh"];
        const service = item["Tên dịch vụ"];
        const revenue = Number(item["Doanh thu"] || 0);

        if (!acc[branch]) {
          acc[branch] = { name: branch };
        }

        // Cộng dồn doanh thu cho dịch vụ cụ thể trong chi nhánh đó
        acc[branch][service] = (acc[branch][service] || 0) + revenue;
        return acc;
      }, {});

      // Bước 2: Lấy danh sách tất cả các loại dịch vụ xuất hiện (để tạo cột Bar)
      const allServices = [...new Set(rawData.map(item => item["Tên dịch vụ"]))];

      // Bước 3: Chuyển object thành mảng và Sort theo tên chi nhánh (giống card trước của bạn)
      const finalData = Object.values(grouped).sort((a, b) => {
        const numA = parseInt(a.name.replace(/[^\d]/g, ""), 10) || 0;
        const numB = parseInt(b.name.replace(/[^\d]/g, ""), 10) || 0;
        return numA - numB;
      });

      setGroupDataFilter(prev => ({
        ...prev,
        data: finalData,
        services: allServices,
        loading: false
      }));

    } catch (error) {
      console.error("Error:", error);
      setGroupDataFilter(prev => ({ ...prev, loading: false }));
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of PETCAREX performance and analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Header: Title + Filter */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Total Revenue
              </h2>

              <DateFilter
                startDate={revenueCard.startDate}
                endDate={revenueCard.endDate}
                onChange={(field, value) =>
                  setRevenueCard(prev => ({ ...prev, [field]: value, error: ""}))
                }
              />

              <button
                onClick={fetchRevenue}
                className="bg-blue-600 text-white px-3 rounded text-sm h-[36px]"
              >
                Lọc
              </button>
            </div>

            {/* Body: Icon + Value */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>

              <p className="text-2xl font-bold text-green-600">
                {revenueCard.value?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>



        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
              <div className="flex items-center gap-2">
                <DateFilter
                  startDate={revenueTrendCard.startDate}
                  endDate={revenueTrendCard.endDate}
                  onChange={(field, value) =>
                    setRevenueTrendCard(prev => ({ ...prev, [field]: value, error: "" }))
                  }
                />
                <button
                  onClick={fetchRevenueTrend}
                  className="bg-blue-600 text-white px-3 rounded text-sm h-[36px]"
                >
                  Lọc
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendCard.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={value => `${value / 1000000}M`} />
                <Tooltip formatter={value => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Revenue (VND)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Service Distribution Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Service Distribution
              </h2>

              <div className="flex items-center gap-2">
                <DateFilter
                  startDate={serviceCard.startDate}
                  endDate={serviceCard.endDate}
                  onChange={(field, value) =>
                    setServiceCard(prev => ({ ...prev, [field]: value, error: ""}))
                  }
                />

                <button
                  onClick={fetchServiceDistribution}
                  className="bg-blue-600 text-white px-2 rounded text-sm h-[36px]"
                >
                  Lọc
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceCard.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {serviceCard.data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Branch Performance Comparison</h2>

            <div className="flex items-center gap-2">
              <DateFilter
                startDate={branchFilter.startDate}
                endDate={branchFilter.endDate}
                onChange={(field, value) =>
                  setBranchFilter(prev => ({ ...prev, [field]: value }))
                }
              />
              <button
                onClick={fetchBranchData}
                className="bg-blue-600 text-white px-3 rounded text-sm h-[36px]"
              >
                Lọc
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={branchFilter.data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              
              <CartesianGrid strokeDasharray="3 3" />
              {/* <XAxis dataKey="branch" /> */}
              <XAxis 
                dataKey="branch"
                interval={0}
                angle={-30}
                textAnchor="end"
                height ={60}
              />

              <YAxis tickFormatter={(value) => `${(value / 1000000)}M`} />
              <Tooltip
                formatter={(value) =>
                  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                }
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              {/* <Legend /> */}
              <Legend verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{ 
                  paddingTop: "60px", // Khoảng cách giữa nhãn chi nhánh và Legend
                  marginTop: "20px" 
                }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (VND)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Service Revenue by Branch</h2>

            <div className="flex items-center gap-2">
              <DateFilter
                startDate={groupDataFilter.startDate}
                endDate={groupDataFilter.endDate}
                onChange={(field, value) =>
                  setGroupDataFilter(prev => ({ ...prev, [field]: value }))
                }
              />
              <button
                onClick={fetchGroupedData}
                className="bg-blue-600 text-white px-3 rounded text-sm h-[36px]"
              >
                Lọc
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={groupDataFilter.data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"  /* Sửa từ "branch" thành "name" */
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={(value) => `${(value / 10000000)}M`} />
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN") + " VND"}
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              <Legend verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{ 
                  paddingTop: "60px", // Khoảng cách giữa nhãn chi nhánh và Legend
                  marginTop: "20px" 
                }}
              />
              
              {/* QUAN TRỌNG: Render cột động dựa trên danh sách dịch vụ */}
              {groupDataFilter.services.map((serviceName, index) => (
                <Bar 
                  key={serviceName} 
                  dataKey={serviceName} 
                  name={serviceName} 
                  fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
