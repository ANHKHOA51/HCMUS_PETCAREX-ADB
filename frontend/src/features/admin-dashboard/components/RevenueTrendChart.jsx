import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueTrendChart = ({ data, loading }) => {

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "VND";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Xu hướng doanh thu</h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data?.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" angle={-30} textAnchor="end" height={60}/>
          <YAxis tickFormatter={value => `${value / 1000000}M`} />
          <Tooltip formatter={value => formatCurrency(value)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Doanh thu (VND)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendChart;
