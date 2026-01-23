import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export default function OrderHistory({ orders }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Deliveries</h3>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              {(order.status === "Delivered" || order.status === "completed") ? (
                <CheckCircle className="size-5 text-green-600" />
              ) : (
                <XCircle className="size-5 text-red-600" />
              )}

              <div>
                <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  {order.restaurant?.name} • {order.address?.fullName || order.user?.name}
                </p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-green-600">
                ₹{order.totalAmount}
              </p>
              <Badge
                variant={
                  order.status === "Delivered"
                    ? "default"
                    : "destructive"
                }
                className="text-xs"
              >
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
