import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Truck,
  DollarSign,
} from "lucide-react";

function AdminSidebar({ onLogout, role }) {
  // Regular Admin Menu (Limited Access)
  const adminMenuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/delivery", label: "Delivery Tracking", icon: Truck },
    { to: "/admin/foods", label: "Food Items", icon: UtensilsCrossed },
    { to: "/admin/customers", label: "Customers", icon: Users },
  ];
  const superAdminMenuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/delivery", label: "Delivery Tracking", icon: Truck },
    { to: "/admin/foods", label: "Food Items", icon: UtensilsCrossed },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/agents", label: "Delivery Agents", icon: Truck },
    { to: "/admin/admins", label: "Admin Management", icon: Shield },
    { to: "/admin/approvals", label: "Pending Approvals", icon: Shield },
    { to: "/admin/settings", label: "System Settings", icon: Settings },
  ];

  const menuItems =
    role === "superadmin" ? superAdminMenuItems : adminMenuItems;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <UtensilsCrossed className="w-6 h-6 text-[#E23744]" />
          <h1 className="text-[20px] font-[800]">FoodFusion</h1>
        </div>
        <p className="text-[12px] text-gray-400">
          {role === "superadmin" ? "Super Admin Panel" : "Admin Panel"}
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                  ? "bg-[#E23744] text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[14px] font-[500]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[14px] font-[500]">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
