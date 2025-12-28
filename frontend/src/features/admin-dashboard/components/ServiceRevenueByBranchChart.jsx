import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SERVICE_COLORS = [
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
];

const ServiceRevenueByBranchChart = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Doanh thu dịch vụ theo chi nhánh</h2>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data?.data || []} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
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
              paddingTop: "60px",
              marginTop: "20px"
            }}
          />

          {(data?.services || []).map((serviceName, index) => (
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
  );
};

export default ServiceRevenueByBranchChart;
