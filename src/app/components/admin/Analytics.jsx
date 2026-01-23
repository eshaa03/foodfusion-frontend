// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const revenueData = [
//   { name: 'Mon', revenue: 4200, orders: 45 },
//   { name: 'Tue', revenue: 5100, orders: 52 },
//   { name: 'Wed', revenue: 4800, orders: 48 },
//   { name: 'Thu', revenue: 6200, orders: 65 },
//   { name: 'Fri', revenue: 7500, orders: 78 },
//   { name: 'Sat', revenue: 8900, orders: 92 },
//   { name: 'Sun', revenue: 7200, orders: 75 },
// ];

// const categoryData = [
//   { name: 'Burgers', value: 2400, sales: 156 },
//   { name: 'Pizza', value: 1800, sales: 98 },
//   { name: 'Healthy', value: 2200, sales: 145 },
//   { name: 'Asian', value: 1600, sales: 87 },
//   { name: 'Mexican', value: 1400, sales: 76 },
// ];

// const COLORS = ['#E23744', '#4CAF50', '#2196F3', '#FFC72C', '#9C27B0'];

// export function Analytics() {
//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-[24px] font-[800] text-gray-800 mb-2">Analytics Dashboard</h2>
//         <p className="text-gray-600 text-[14px]">Insights and performance metrics</p>
//       </div>

//       {/* Revenue Chart */}
//       <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
//         <h3 className="text-[18px] font-[700] text-gray-800 mb-4">Weekly Revenue</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={revenueData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis dataKey="name" stroke="#666" />
//             <YAxis stroke="#666" />
//             <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }} />
//             <Legend />
//             <Line type="monotone" dataKey="revenue" stroke="#E23744" strokeWidth={3} dot={{ fill: '#E23744', r: 5 }} activeDot={{ r: 7 }} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Orders Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <h3 className="text-[18px] font-[700] text-gray-800 mb-4">Daily Orders</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={revenueData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="name" stroke="#666" />
//               <YAxis stroke="#666" />
//               <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }} />
//               <Bar dataKey="orders" fill="#4CAF50" radius={[8, 8, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Category Distribution */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <h3 className="text-[18px] font-[700] text-gray-800 mb-4">Sales by Category</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {categoryData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Top Items Table */}
//       <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
//         <div className="p-6 border-b">
//           <h3 className="text-[18px] font-[700] text-gray-800">Top Selling Items</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-[12px] font-[700] text-gray-700 uppercase">Rank</th>
//                 <th className="px-6 py-3 text-left text-[12px] font-[700] text-gray-700 uppercase">Item</th>
//                 <th className="px-6 py-3 text-left text-[12px] font-[700] text-gray-700 uppercase">Sales</th>
//                 <th className="px-6 py-3 text-left text-[12px] font-[700] text-gray-700 uppercase">Revenue</th>
//                 <th className="px-6 py-3 text-left text-[12px] font-[700] text-gray-700 uppercase">Trend</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {categoryData.map((item, index) => (
//                 <tr key={item.name} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-[700] text-gray-800">{index + 1}</span>
//                   </td>
//                   <td className="px-6 py-4 font-[600] text-gray-800">{item.name}</td>
//                   <td className="px-6 py-4 text-gray-600">{item.sales} orders</td>
//                   <td className="px-6 py-4 font-[600] text-gray-800">${item.value.toLocaleString()}</td>
//                   <td className="px-6 py-4">
//                     <span className="text-green-600 text-[14px] font-[600]">↑ {(Math.random() * 20 + 5).toFixed(1)}%</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

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
        // Assuming item.food has a category, or we default to "Other"
        // Note: Backend population of 'items.food' is required for this to work perfectly
        // If items structure is just { name, quantity, price }, we might need name-based grouping if category isn't there
        // Let's assume item has category if populated, or we use a placeholder
        const cat = item.food?.category || "General";

        if (!categoryMap[cat]) {
          categoryMap[cat] = { name: cat, value: 0 };
        }
        // Fix: Use item.qty (from mongoose schema) instead of item.quantity
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

