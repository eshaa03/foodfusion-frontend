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
import {
  CheckCircle,
  Circle,
  MapPin,
  Package,
  Truck,
  Home,
  IndianRupee,
  Navigation,
} from "lucide-react";
import { useState } from "react";

const StatusUpdateDialog = forwardRef(({
  open,
  onOpenChange,
  currentStatus,
  orderId,
  onUpdateStatus,
  isPaid,
  paymentMethod,
  onCollectPayment,
}, ref) => {
  const [showPayment, setShowPayment] = useState(false);

  const statuses = [
    {
      id: "accepted", // Was "Assigned"
      label: "Order Accepted",
      icon: CheckCircle,
      description: "You have accepted this order",
    },
    {
      id: "picked_up",
      label: "Picked Up",
      icon: Package,
      description: "Food collected from restaurant",
    },
    {
      id: "in_transit",
      label: "In Transit",
      icon: Truck,
      description: "On the way to customer",
    },
    {
      id: "Delivered",
      label: "Delivered",
      icon: Home,
      description: "Order delivered successfully",
    },
  ];


  const currentIndex = statuses.findIndex(
    (s) => s.id === currentStatus
  );

  console.log("StatusUpdateDialog Props:", { currentStatus, paymentMethod, isPaid, orderId });

  const handleStatusClick = (statusId) => {
    console.log("Click Status:", statusId);
    console.log("Check:", { isCOD: paymentMethod === "COD", notPaid: !isPaid });

    if (statusId === "Delivered" && paymentMethod === "COD" && !isPaid) {
      console.log("Showing Payment Dialog");
      setShowPayment(true);
    } else {
      console.log("Updating Status Directly");
      onUpdateStatus(statusId);
      onOpenChange(false);
    }
  };

  if (showPayment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>
              Order #{orderId} - Collect payment before completing delivery
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              onClick={() => {
                onCollectPayment("Cash");
                setShowPayment(false);
              }}
            >
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <IndianRupee className="size-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Cash collected</div>
                <div className="text-xs opacity-70">Customer paid via cash</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
              onClick={() => {
                onCollectPayment("UPI");
                setShowPayment(false);
              }}
            >
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <IndianRupee className="size-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Paid via UPI</div>
                <div className="text-xs opacity-70">Payment received online</div>
              </div>
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowPayment(false)}
            >
              Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Delivery Status</DialogTitle>
          <DialogDescription>
            Order #{orderId} - Update current status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {statuses.map((status, index) => {
            const Icon = status.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = status.id === currentStatus;
            const isAvailable = index <= currentIndex + 1;

            return (
              <button
                key={status.id}
                onClick={() =>
                  isAvailable && handleStatusClick(status.id)
                }
                disabled={!isAvailable}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${isCurrent
                  ? "bg-orange-50 border-orange-500"
                  : isCompleted
                    ? "bg-green-50 border-green-300"
                    : isAvailable
                      ? "bg-white border-gray-200 hover:bg-gray-50"
                      : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="size-5 text-green-600" />
                  ) : isCurrent ? (
                    <Circle className="size-5 text-orange-500 fill-orange-500" />
                  ) : (
                    <Circle className="size-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <p className="font-medium">{status.label}</p>
                    {isCurrent && (
                      <Badge variant="secondary" className="ml-auto">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {status.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

StatusUpdateDialog.displayName = "StatusUpdateDialog";
export default StatusUpdateDialog;
