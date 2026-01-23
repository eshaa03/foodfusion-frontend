import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout({ user, onLogout }) {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (user.role !== "admin") return;

    fetch("http://localhost:5000/api/admin/restaurant", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setRestaurant(data));
  }, [user.role]);

  useEffect(() => {
  const handler = (e) => setRestaurant(e.detail);
  window.addEventListener("restaurantUpdated", handler);
  return () => window.removeEventListener("restaurantUpdated", handler);
}, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar role={user.role} onLogout={onLogout} />

      <div className="flex-1 flex flex-col">
        <AdminTopbar restaurant={restaurant} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ restaurant }} />
        </main>
      </div>
    </div>
  );
}
