import { useState, useEffect } from "react";
import { getAdminOrders, getSuperAdminOrders } from "../../../api/api";
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
import { format, startOfWeek, addDays, getDay } from "date-fns";

const COLORS = ["#E23744", "#4CAF50", "#2196F3", "#FFC72C", "#9C27B0", "#FF5722"];

function Analytics({ title }) {
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check role
    const user = JSON.parse(localStorage.getItem("user"));
    const isSuperAdmin = user?.role === "superadmin";

    const fetchOrders = isSuperAdmin ? getSuperAdminOrders : getAdminOrders;

    fetchOrders()
      .then((res) => {
        const data = res.data;
        setOrders(data);
        processAnalytics(data);
      })
      .catch((err) => console.error("Failed to load analytics", err))
      .finally(() => setLoading(false));
  }, []);

  const processAnalytics = (data) => {
    // 1. Weekly Revenue & Orders (Last 7 Days)
    // Initialize last 7 days with 0
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        name: format(d, "EEE"), // Mon, Tue...
        dateString: d.toDateString(),
        revenue: 0,
        orders: 0,
      };
    });

    data.forEach((order) => {
      const orderDate = new Date(order.createdAt).toDateString();
      const dayStat = last7Days.find((d) => d.dateString === orderDate);
      if (dayStat) {
        dayStat.revenue += order.totalAmount;
        dayStat.orders += 1;
      }
    });
    setRevenueData(last7Days);

    // 2. Category Distribution
    const categoryMap = {};
    data.forEach((order) => {
      order.items.forEach((item) => {
        const cat = item.food?.category || "General";

        if (!categoryMap[cat]) {
          categoryMap[cat] = { name: cat, value: 0 };
        }
        categoryMap[cat].value += (item.qty || 0) * (item.price || 0); // Value by Revenue
      });
    });

    // Convert to array
    setCategoryData(Object.values(categoryMap));
  };


  if (loading) return <div className="p-10 text-center">Loading analytics...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
          {title || "Analytics Dashboard"}
        </h2>
        <p className="text-gray-600 text-[14px]">
          REAL-TIME Insights based on {orders.length} orders
        </p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-[18px] font-[700] text-gray-800 mb-4">
          Weekly Revenue (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#E23744"
              strokeWidth={3}
              dot={{ fill: "#E23744", r: 5 }}
              activeDot={{ r: 7 }}
              name="Revenue (₹)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[18px] font-[700] text-gray-800 mb-4">
            Daily Orders
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis allowDecimals={false} stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="orders" fill="#4CAF50" radius={[8, 8, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[18px] font-[700] text-gray-800 mb-4">
            Sales by Category (₹)
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Not enough data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

