import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const steps = [
    "Placed",
    "Preparing",
    "Ready",
    "Assigned",
    "Picked Up",
    "In Transit",
    "Delivered",
  ];

  const [order, setOrder] = useState(null);

  const currentStep = order
    ? steps.indexOf(order.deliveryStatus) !== -1
      ? steps.indexOf(order.deliveryStatus)
      : steps.indexOf(order.status)
    : 0;


  const markDelivered = async () => {
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "Delivered" }),
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || orderId === "undefined") return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const navigate = useNavigate();

  // ... (rest of code)
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Track Order</h2>
          <p className="text-sm text-gray-500">
            Tracking ID: <span className="font-mono font-medium text-gray-700">{orderId}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step} className="flex items-start gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                    ${isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "border-blue-500 text-blue-500"
                        : "border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? <CheckCircle size={18} /> : index + 1}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`w-[2px] h-10 mt-1 ${index < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                )}
              </div>

              <div>
                <p
                  className={`font-semibold ${isCompleted
                    ? "text-green-600"
                    : isActive
                      ? "text-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  {step}
                </p>
                <p className="text-sm text-gray-400">
                  {isCompleted
                    ? "Completed"
                    : isActive
                      ? "In progress"
                      : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

