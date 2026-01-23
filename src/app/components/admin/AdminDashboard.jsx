import { useNavigate } from "react-router-dom";
import DashboardStats from "./DashboardStats";
import { Users, Truck, DollarSign, Clock, IndianRupee } from "lucide-react";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../api/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    pendingOrders: 0,
    activeDeliveries: 0,
  });

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats", err));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 text-[14px]">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-[18px] font-[700] text-gray-800 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Orders */}
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-[600] text-gray-800 mb-1">
              Pending Orders
            </h4>
            <p className="text-[24px] font-[800] text-yellow-600">
              {stats.pendingOrders}
            </p>
          </button>

          {/* Customers */}
          <button
            onClick={() => navigate("/admin/customers")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-[600] text-gray-800 mb-1">
              Customers
            </h4>
            <p className="text-[24px] font-[800] text-blue-600">
              {stats.activeCustomers}
            </p>
          </button>

          {/* Delivery */}
          <button
            onClick={() => navigate("/admin/delivery")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-[600] text-gray-800 mb-1">
              Deliveries
            </h4>
            <p className="text-[24px] font-[800] text-purple-600">
              {stats.activeDeliveries}
            </p>
          </button>

          {/* Revenue */}
          <button
            onClick={() => navigate("/admin/analytics")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-[600] text-gray-800 mb-1">
              Revenue
            </h4>
            <p className="text-[24px] font-[800] text-green-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
