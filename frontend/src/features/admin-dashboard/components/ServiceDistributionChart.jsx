import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const SERVICE_COLORS = [
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
];

const ServiceDistributionChart = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Phân bổ dịch vụ
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data?.data || []}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {(data?.data || []).map((entry, index) => (
              <Cell key={index} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceDistributionChart;
