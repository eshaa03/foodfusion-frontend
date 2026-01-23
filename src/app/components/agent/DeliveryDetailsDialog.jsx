import { forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import StatusTimeline from "./StatusTimeline";
import {
  MapPin,
  Phone,
  Navigation,
  IndianRupee,
  Package,
  User,
} from "lucide-react";

const DeliveryDetailsDialog = forwardRef(({
  open,
  onOpenChange,
  order,
  onNavigate,
  onCall,
  onUpdateStatus,
}, ref) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order._id?.slice(-6)}</span>
            <Badge className="bg-orange-500 text-white">
              {order.totalAmount}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {order.restaurant?.name || "Unknown Restaurant"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="size-4 text-gray-600" />
              <h4 className="font-medium">Customer</h4>
            </div>
            <p className="text-sm">{order.address?.fullName || order.user?.name || "Guest"}</p>
            <p className="text-sm text-gray-600">{order.address?.phone || order.user?.phone}</p>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <MapPin className="size-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pickup Location</p>
                <p className="text-sm text-gray-600">
                  {order.restaurant?.address || "Address not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="size-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-gray-600">
                  {order.address?.street}, {order.address?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Package className="size-4 text-gray-500" />
              <span>{order.items?.length || 0} items</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="size-4 text-gray-500" />
              <span>{order.distance || "2.5 km"}</span> {/* Mock distance if missing */}
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="size-4 text-green-600" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  {order.totalAmount}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-5 ${order.paymentMethod === "COD"
                    ? "border-red-500 text-red-600 bg-red-50"
                    : "border-green-500 text-green-600 bg-green-50"
                    }`}
                >
                  {order.paymentMethod === "COD" ? "COD" : "PAID"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Timeline */}
          <div>
            <h4 className="font-medium mb-3">Delivery Progress</h4>
            <StatusTimeline
              currentStatus={order.deliveryStatus || order.status} // Use deliveryStatus first
              statusHistory={order.statusHistory || []}
            />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => {
                onUpdateStatus?.();
                onOpenChange(false);
              }}
            >
              Update Status
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onNavigate?.();
                  onOpenChange(false);
                }}
              >
                <Navigation className="size-4 mr-2" />
                Navigate
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onCall?.();
                  onOpenChange(false);
                }}
              >
                <Phone className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DeliveryDetailsDialog.displayName = "DeliveryDetailsDialog";
export default DeliveryDetailsDialog;
