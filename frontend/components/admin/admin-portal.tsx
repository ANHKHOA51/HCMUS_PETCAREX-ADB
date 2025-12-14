"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { date: "Dec 1", revenue: 4500 },
  { date: "Dec 2", revenue: 3800 },
  { date: "Dec 3", revenue: 5200 },
  { date: "Dec 4", revenue: 4100 },
  { date: "Dec 5", revenue: 6300 },
  { date: "Dec 6", revenue: 5800 },
  { date: "Dec 7", revenue: 7200 },
  { date: "Dec 8", revenue: 6900 },
  { date: "Dec 9", revenue: 5400 },
  { date: "Dec 10", revenue: 8100 },
];

const serviceRevenueData = [
  { name: "Medical", value: 45, amount: 45000 },
  { name: "Grooming", value: 30, amount: 30000 },
  { name: "Retail", value: 25, amount: 25000 },
];

const branchRevenueData = [
  { branch: "Downtown", revenue: 28000, orders: 145 },
  { branch: "Westside", revenue: 32000, orders: 168 },
  { branch: "Suburban", revenue: 24000, orders: 132 },
  { branch: "East End", revenue: 16000, orders: 95 },
];

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

export function AdminPortal() {
  const [dateRange, setDateRange] = useState("monthly");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const totalRevenue = branchRevenueData.reduce(
    (sum, branch) => sum + branch.revenue,
    0
  );
  const totalOrders = branchRevenueData.reduce(
    (sum, branch) => sum + branch.orders,
    0
  );
  const newCustomers = 87;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl text-foreground">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Revenue analytics and system management
          </p>
        </div>
        <div className="flex gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Branch</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="westside">Westside</SelectItem>
                <SelectItem value="suburban">Suburban</SelectItem>
                <SelectItem value="eastend">East End</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalOrders}</div>
            <p className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{newCustomers}</div>
            <p className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+15.3%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Daily revenue over the last 10 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Type</CardTitle>
            <CardDescription>
              Distribution across service categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceRevenueData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `$${props.payload.amount.toLocaleString()}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceRevenueData.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ${service.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Branch Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
            <CardDescription>
              Revenue comparison between branches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchRevenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="branch"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name="Revenue ($)"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {branchRevenueData.map((branch) => (
                <div
                  key={branch.branch}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{branch.branch}</span>
                  <div className="flex gap-4 text-muted-foreground">
                    <span>${branch.revenue.toLocaleString()}</span>
                    <span>{branch.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
