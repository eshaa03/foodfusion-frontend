import { useState, useEffect } from "react";
import { getAdminOrders } from "../../../api/api";
import { Truck, MapPin, Clock, Phone } from "lucide-react";

function Delivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminOrders()
            .then((res) => {
                // Filter for active delivery statuses
                const activeStatuses = ["Assigned", "Picked Up", "In Transit", "Out for Delivery"];
                const outForDelivery = res.data.filter(
                    (order) => activeStatuses.includes(order.status) || activeStatuses.includes(order.deliveryStatus)
                );
                setDeliveries(outForDelivery);
            })
            .catch((err) => console.error("Failed to load deliveries", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-[24px] font-[800] text-gray-800 mb-2">Delivery Tracking</h2>
                <p className="text-gray-600 text-[14px]">
                    Track active deliveries and agents
                </p>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Loading deliveries...</div>
            ) : deliveries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deliveries.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Order #{order._id.slice(-6)}</h3>
                                        <p className="text-xs text-purple-600 font-semibold">{order.status}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-800">₹{order.totalAmount}</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Delivery Address</p>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {typeof order.address === 'object'
                                                ? `${order.address.street || ''}, ${order.address.city || ''}`
                                                : order.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Estimated Time</p>
                                        <p className="text-xs text-gray-500">30-45 mins</p>
                                    </div>
                                </div>

                                {/* Agent Info (if available) - Assuming backend populates 'deliveryAgent' */}
                                {order.deliveryAgent && order.deliveryAgent.user && (
                                    <div className="flex items-center gap-3 pt-3 border-t">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold">{order.deliveryAgent.user.name?.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{order.deliveryAgent.user.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Phone size={12} /> {order.deliveryAgent.user.phone || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Restaurant Info */}
                                <div className="mt-2 text-xs text-gray-500">
                                    Restaurant: <span className="font-semibold text-gray-700">{order.restaurant?.name || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">No Active Deliveries</h3>
                    <p className="text-gray-500">There are currently no orders out for delivery.</p>
                </div>
            )}
        </div>
    );
}

export default Delivery;
