import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BranchPerformanceChart = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Branch Performance Comparison</h2>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data?.data || []} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="branch"
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />

          <YAxis tickFormatter={(value) => `${(value / 1000000)}M`} />
          <Tooltip
            formatter={(value) =>
              value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            }
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
          <Legend verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: "60px",
              marginTop: "20px"
            }}
          />
          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (VND)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BranchPerformanceChart;
