import { CheckCircle, Circle } from "lucide-react";

export default function StatusTimeline({ currentStatus, statusHistory }) {
  const allStatuses = [
    { id: "accepted", label: "Order Accepted" },
    { id: "picked_up", label: "Picked Up" },
    { id: "in_transit", label: "In Transit" },
    { id: "Delivered", label: "Delivered" },
  ];

  const currentIndex = allStatuses.findIndex(
    (s) => s.id === currentStatus
  );

  return (
    <div className="relative">
      {allStatuses.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = status.id === currentStatus;
        const historyItem = statusHistory.find(
          (h) => h.status === status.id
        );

        return (
          <div key={status.id} className="flex gap-3 pb-4 last:pb-0">
            <div className="relative flex flex-col items-center">
              {isCompleted ? (
                <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
              ) : isCurrent ? (
                <Circle className="size-5 text-orange-500 fill-orange-500 flex-shrink-0" />
              ) : (
                <Circle className="size-5 text-gray-300 flex-shrink-0" />
              )}

              {index < allStatuses.length - 1 && (
                <div
                  className={`w-0.5 h-full mt-1 ${isCompleted ? "bg-green-600" : "bg-gray-200"
                    }`}
                />
              )}
            </div>

            <div className="flex-1 pb-2">
              <p
                className={`font-medium ${isCurrent
                  ? "text-orange-600"
                  : isCompleted
                    ? "text-gray-900"
                    : "text-gray-400"
                  }`}
              >
                {status.label}
              </p>

              {historyItem && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {historyItem.timestamp}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
