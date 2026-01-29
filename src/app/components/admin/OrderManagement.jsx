import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "../../../api/api";
import { getSuperAdminOrders } from "../../../api/api";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const getStatusColor = (status) => {
    const colors = {
      Placed: "bg-yellow-100 text-yellow-700",
      Preparing: "bg-blue-100 text-blue-700",
      Ready: "bg-indigo-100 text-indigo-700",
      Assigned: "bg-purple-100 text-purple-700",
      "Picked Up": "bg-orange-100 text-orange-700",
      "In Transit": "bg-cyan-100 text-cyan-700",
      Delivered: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Placed: <Clock className="w-4 h-4" />,
      Preparing: <UtensilsCrossed className="w-4 h-4" />,
      "Out for Delivery": <Truck className="w-4 h-4" />,
      Delivered: <CheckCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  /* ---------------- STATE ---------------- */
  const [activeTab, setActiveTab] = useState("active"); // "active" | "history"
  const [showFilterMenu, setShowFilterMenu] = useState(false); // Toggle dropdown
  const [viewingOrder, setViewingOrder] = useState(null); // Selected order for modal

  const filteredOrders = orders.filter((order) => {
    // 1. Text Search
    const idMatch = order._id?.toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());


    const isHistory =
      ["Delivered", "Cancelled"].includes(order.status) ||
      order.deliveryStatus === "Delivered";

    const matchesTab = activeTab === "history" ? isHistory : !isHistory;

   
    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter ||
      order.deliveryStatus === statusFilter;

    return (idMatch || nameMatch) && matchesTab && matchesStatus;
  });

  useEffect(() => {
    if (!role) return;

    if (role === "superadmin") {
      getSuperAdminOrders()
        .then((res) => setOrders(res.data || []))
        .catch(console.error);
    } else if (role === "admin") {
      getAdminOrders()
        .then((res) => setOrders(res.data || []))
        .catch(console.error);
    }
  }, [role]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      const updatedOrder = res.data;

      // Refresh local state with FULL updated order (including assigned agent)
      setOrders(prev => prev.map(o =>
        o._id === orderId ? updatedOrder : o
      ));

      // Optionally reload from server to get side-effects like assigned agent
      if (newStatus === "Ready") {
        setTimeout(() => {
          if (role === "admin") getAdminOrders().then(res => setOrders(res.data));
          if (role === "superadmin") getSuperAdminOrders().then(res => setOrders(res.data));
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert(error.response?.data?.message || "Failed to update status. Check if an agent is available.");
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
          Order Management
        </h2>
        <p className="text-gray-600 text-[14px]">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        {/* TABS */}
        <div className="flex gap-4 border-b mb-4">
          <button
            onClick={() => { setActiveTab("active"); setStatusFilter("all"); }}
            className={`pb-2 px-1 font-semibold text-sm transition-colors relative ${activeTab === "active"
              ? "text-[#E23744]"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Active Orders
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E23744]" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab("history"); setStatusFilter("all"); }}
            className={`pb-2 px-1 font-semibold text-sm transition-colors relative ${activeTab === "history"
              ? "text-[#E23744]"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Order History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E23744]" />
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E23744]"
            />
          </div>

          {/* ICON-ONLY FILTER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 rounded-lg border transition-colors ${statusFilter !== "all"
                ? "bg-red-50 border-[#E23744] text-[#E23744]"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
            >
              <Filter className="w-5 h-5" />
            </button>

            {showFilterMenu && (
              <>
                {/* Backdrop to close */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterMenu(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => { setStatusFilter("all"); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === 'all' ? 'font-bold text-[#E23744] bg-red-50' : 'text-gray-700'}`}
                  >
                    All Status
                  </button>

                  {activeTab === "active" ? (
                    <>
                      {/* Admin sees fewer statuses */}
                      {(role === "admin"
                        ? ["Placed", "Preparing", "Ready"]
                        : ["Placed", "Preparing", "Ready", "Assigned", "Picked Up", "In Transit"]
                      ).map(status => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === status ? 'font-bold text-[#E23744] bg-red-50' : 'text-gray-700'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {["Delivered", "Cancelled"].map(status => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === status ? 'font-bold text-[#E23744] bg-red-50' : 'text-gray-700'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Order ID
                </th>
                {role === "superadmin" && (
                  <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                    Restaurant
                  </th>
                )}
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Agent
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-[600] text-gray-800">
                    {order._id}
                  </td>

                  {role === "superadmin" && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.restaurant?.name || "N/A"}
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <p className="font-[600] text-gray-800">
                      {order.user?.name || "—"}
                    </p>
                    <p className="text-[12px] text-gray-500">
                      {order.address?.street || ""}{" "}
                      {order.address?.city || ""}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-[14px] text-gray-600">
                    {Array.isArray(order.items)
                      ? order.items.map((i, index) => (
                        <div key={index} className="mb-1">
                          <span className="font-medium">{i.name}</span>
                          {i.customizations?.ingredients?.length > 0 && (
                            <span className="text-[12px] text-gray-500 block">
                              + {i.customizations.ingredients.join(", ")}
                            </span>
                          )}
                          {i.customizations?.portionSize && i.customizations.portionSize !== "regular" && (
                            <span className="text-[12px] text-gray-500 block">
                              Size: {i.customizations.portionSize}
                            </span>
                          )}
                        </div>
                      ))
                      : "—"}
                  </td>

                  <td className="px-6 py-4 font-[700] text-gray-800">
                    ₹{order.totalAmount}
                  </td>

                  <td className="px-6 py-4">
                    <div className="relative">
                      {(role === "admin" || role === "superadmin") ? (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`appearance-none cursor-pointer pl-3 pr-8 py-1 rounded-full text-[12px] font-[600] border-none focus:ring-2 focus:ring-opacity-50 ${getStatusColor(order.status)}`}
                        >
                          {role === "admin"
                            ? ["Placed", "Preparing", "Ready"].map((s) => (
                              <option key={s} value={s} className="bg-white text-gray-800">
                                {s}
                              </option>
                            ))
                            : ["Placed", "Preparing", "Ready", "Assigned", "Picked Up", "In Transit", "Delivered"].map((s) => (
                              <option key={s} value={s} className="bg-white text-gray-800">
                                {s}
                              </option>
                            ))
                          }
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-[600] ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.deliveryAgent?.user?.name || order.deliveryAgent?.name || "Unassigned"}
                  </td>

                  <td className="px-6 py-4 text-[14px] text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg group"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-gray-400 group-hover:text-[#E23744] transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {viewingOrder && (
        <OrderDetailsModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          role={role}
        />
      )}

    </div>
  );
}

// ---------------- SUB-COMPONENTS ---------------- //

function OrderDetailsModal({ order, onClose, role }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b shrink-0 bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
            <p className="text-sm text-gray-500 font-mono">#{order._id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:bg-gray-100 transition-colors"
          >
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto space-y-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-300">
          {/* 1. Status & Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {order.status}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date</p>
              <p className="font-[600] text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total</p>
              <p className="font-[600] text-sm text-[#E23744]">₹{order.totalAmount}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Payment</p>
              <p className="font-[600] text-sm">Online / COD</p>
            </div>
          </div>

          {/* 2. Customer & Address */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                User Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl space-y-1 text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.user?.name}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="font-medium">{order.user?.email || "—"}</span></p>
                <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.address?.phone || "—"}</span></p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                Delivery Address
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl text-sm">
                <p className="font-medium">{order.address?.street}</p>
                <p className="text-gray-600">{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
              </div>
            </div>
          </div>

          {/* 3. Items List */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Order Items</h4>
            <div className="border rounded-xl divide-y overflow-hidden">
              {order.items?.map((item, idx) => {
                const imageUrl = item.food?.image
                  ? (item.food.image.startsWith("http") ? item.food.image : `http://localhost:5000${item.food.image}`)
                  : (item.image?.startsWith("http") ? item.image : (item.image ? `http://localhost:5000${item.image}` : null));

                return (
                  <div key={idx} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-gray-800">{item.name}</h5>
                        <span className="font-bold text-gray-900">₹{item.price}</span>
                      </div>
                      {/* Portion & Qty */}
                      <div className="text-xs text-gray-500 mb-1">
                        Qty: <span className="font-bold text-gray-800">{item.qty || item.quantity}</span>
                        {item.customizations?.portionSize && (
                          <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                            {item.customizations.portionSize}
                          </span>
                        )}
                      </div>
                      {/* Ingredients */}
                      {item.customizations?.ingredients?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.customizations.ingredients.map((ing, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                              + {ing}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


function UtensilsCrossed({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

export default OrderManagement;
