import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ restaurant }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!restaurant) return null;

  const imageUrl = restaurant.image
    ? `http://localhost:5000${restaurant.image}`
    : null;

  return (
    <header className="h-16 bg-white border-b flex items-center justify-end px-6">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          {/* ✅ IMAGE OR FALLBACK */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={restaurant.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#E23744] text-white flex items-center justify-center font-bold">
              {restaurant.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* NAME */}
          <div className="text-left hidden sm:block">
            <p className="text-[14px] font-[600] text-gray-800">
              {restaurant.name}
            </p>
            <p className="text-[12px] text-gray-500">
              Restaurant Admin
            </p>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            <button
              onClick={() => {
                navigate("/admin/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
            >
              <User className="w-4 h-4" />
              Restaurant Profile
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
