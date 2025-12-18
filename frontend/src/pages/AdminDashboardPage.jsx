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

// Mock analytics data
const revenueData = [
  { month: "Jan", revenue: 45000000, appointments: 120 },
  { month: "Feb", revenue: 52000000, appointments: 145 },
  { month: "Mar", revenue: 48000000, appointments: 135 },
  { month: "Apr", revenue: 61000000, appointments: 170 },
  { month: "May", revenue: 55000000, appointments: 155 },
  { month: "Jun", revenue: 67000000, appointments: 185 },
]

// const serviceData = [
//   { name: "Consultation", value: 35, color: "#3b82f6" },
//   { name: "Vaccination", value: 25, color: "#10b981" },
//   { name: "Surgery", value: 20, color: "#f59e0b" },
//   { name: "Grooming", value: 15, color: "#8b5cf6" },
//   { name: "Other", value: 5, color: "#ef4444" },
// ]
const SERVICE_COLORS = [
  //"#3b82f6",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  //"#ef4444",
];


const branchData = [
  { branch: "District 1", revenue: 180000000, patients: 450 },
  { branch: "District 3", revenue: 165000000, patients: 420 },
  { branch: "District 5", revenue: 142000000, patients: 380 },
  { branch: "District 7", revenue: 158000000, patients: 410 },
]

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
  

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   }).format(amount)
  // }


  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "₫0";
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
    loading: false,
  });

  // ===== SERVICE DISTRIBUTION STATE =====
const [serviceCard, setServiceCard] = useState({
  startDate: "2025-01-01",
  endDate: new Date().toISOString().slice(0, 10),
  data: [],
  loading: false,
});


  const fetchRevenue = async () => {
    console.log("Filter:", revenueCard.startDate, revenueCard.endDate);
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
    try {
      setServiceCard(prev => ({ ...prev, loading: true }));

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

      const totalRevenue = rawData.reduce(
        (sum, item) => sum + Number(item.TongDoanhThu || item.DoanhThu || 0),
      0
      );
      // 2️⃣ Map sang dạng PieChart cần (%)
      const chartData = rawData.map((item, index) => ({
        name: item.TenDichVu,
        value: totalRevenue > 0
          ? Number(((Number(item.TongDoanhThu) / totalRevenue) * 100).toFixed(1))
          : 0,
        color: SERVICE_COLORS[index % SERVICE_COLORS.length],
      }));

      console.log("RAW API DATA:", res.data);
      console.log("RAW DATA:", rawData);
      console.log("TOTAL REVENUE:", totalRevenue);
      console.log("CHART DATA:", chartData);

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
                  setRevenueCard(prev => ({ ...prev, [field]: value }))
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
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend (6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue (VND)" />
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
                    setServiceCard(prev => ({ ...prev, [field]: value }))
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
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Branch Performance Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Revenue (VND)") return formatCurrency(value)
                  return value
                }}
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (VND)" />
              <Bar dataKey="patients" fill="#10b981" name="Total Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
