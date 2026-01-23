import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  IndianRupee,
  RefreshCw,
  Store,
} from "lucide-react";

export default function DeliveryCard({
  order,
  onStartDelivery,
  onCompleteDelivery,
  onNavigate,
  onCall,
  onUpdateStatus,
}) {
  const statusConfig = {
    assigned: { color: "bg-blue-500", label: "Assigned" },
    accepted: { color: "bg-blue-500", label: "Accepted" },
    heading_to_restaurant: { color: "bg-purple-500", label: "Heading to Pickup" },
    arrived_at_restaurant: { color: "bg-yellow-500", label: "At Restaurant" },
    picked_up: { color: "bg-orange-500", label: "Picked Up" },
    in_transit: { color: "bg-blue-500", label: "In Transit" },
    nearby: { color: "bg-green-500", label: "Nearby Customer" },
    arrived: { color: "bg-green-600", label: "Arrived" },
    delivered: { color: "bg-green-700", label: "Delivered" },
  };

  const statusKey = order.deliveryStatus?.toLowerCase().replace(/ /g, "_") || order.status?.toLowerCase().replace(/ /g, "_");
  const config =
    statusConfig[statusKey] || {
      color: "bg-gray-500",
      label: order.deliveryStatus || order.status || "Unknown",
    };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
          <p className="text-sm text-gray-600">{order.restaurant?.name}</p>
        </div>
        <Badge className={`${config.color} text-white`}>
          {config.label}
        </Badge>
      </div>

      {/* Restaurant Info */}
      <div className="mb-4 p-3 bg-orange-50 rounded-lg flex gap-3">
        <Store className="w-5 h-5 text-orange-600 mt-1" />
        <div>
          <p className="text-xs text-orange-600 font-bold uppercase mb-1">Pickup From</p>
          <h4 className="font-bold text-gray-800">{order.restaurant?.name || "Unknown Restaurant"}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{order.restaurant?.address || "Address not available"}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-2">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Deliver To</p>
            <h4 className="font-bold text-gray-800">{order.address?.fullName || order.user?.name || "Customer"}</h4>
            {(order.address?.phone || order.user?.phone) && (
              <p className="text-sm text-gray-800 font-medium mb-1 flex items-center gap-1">
                <Phone className="size-3" /> {order.address?.phone || order.user?.phone}
              </p>
            )}
            <p className="text-sm text-gray-600 line-clamp-2">
              {order.address?.street}, {order.address?.city}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="size-4 text-gray-500" />
            <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="size-4 text-green-600" />
            <span className="font-semibold text-green-600">
              {order.totalAmount}
            </span>
            <Badge
              variant="outline"
              className={`ml-2 text-[10px] px-1.5 py-0 h-5 ${order.isPaid
                ? "border-green-500 text-green-600 bg-green-50"
                : "border-red-500 text-red-600 bg-red-50"
                }`}
            >
              {order.isPaid ? "PAID" : "NOT PAID"}
            </Badge>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-gray-600">
            {order.items?.length || 0} items
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onUpdateStatus}>
          <RefreshCw className="size-4 mr-1" />
          Update Status
        </Button>

        <Button variant="outline" size="sm" onClick={onNavigate}>
          <Navigation className="size-4 mr-1" />
          Navigate
        </Button>

        <Button variant="outline" size="sm" onClick={onCall}>
          <Phone className="size-4" />
        </Button>

        {order.status === "arrived" && (
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onCompleteDelivery}
          >
            Complete Delivery
          </Button>
        )}
      </div>
    </Card>
  );
}
