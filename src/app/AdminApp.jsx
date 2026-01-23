import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";

import AdminDashboard from "./components/admin/AdminDashboard";
import OrderManagement from "./components/admin/OrderManagement";
import FoodManagement from "./components/admin/FoodManagement";
import Analytics from "./components/admin/Analytics";
import AdminManagement from "./components/admin/AdminManagement";
import AdminProfile from "./components/admin/AdminProfile";
import PendingApprovals from "./components/admin/PendingApprovals";
import AdminsList from "./components/admin/AdminsList";
import AgentsList from "./components/admin/AgentsList";
import SystemSettings from "./components/admin/SystemSettings";

import Customers from "./components/admin/Customers";
import Delivery from "./components/admin/Delivery";

export function AdminApp({ user, onLogout }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<AdminLayout user={user} onLogout={onLogout} />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="foods" element={<FoodManagement />} />
        <Route path="customers" element={<Customers />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="revenue" element={<Analytics title="Revenue Reports" />} />
        <Route path="settings" element={<SystemSettings />} />
        {user.role === "superadmin" && (
          <>
            <Route path="approvals" element={<PendingApprovals />} />
            <Route path="admins" element={<AdminsList />} />
            <Route path="agents" element={<AgentsList />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/admin" />} />
        <Route
          path="profile"
          element={<AdminProfile user={user} />}
        />
      </Route>
    </Routes>
  );
}
