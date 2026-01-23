import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AgentHeader from "./AgentHeader";
import EarningsCard from "./EarningsCard";
import StatsGrid from "./StatsGrid";
import DeliveryCard from "./DeliveryCard";
import OrderHistory from "./OrderHistory";
import StatusUpdateDialog from "./StatusUpdateDialog";
import DeliveryDetailsDialog from "./DeliveryDetailsDialog";
import ServiceStatusCard from "./ServiceStatusCard";
import API, { toggleAgentStatus } from "@/api/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/app/components/ui/sonner";
const user = JSON.parse(localStorage.getItem("user"));

export default function AgentDashboard() {
  const [isOnline, setIsOnline] = useState(false); // Default to false until fetched
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  /* ============================
     NOTIFICATIONS & POLLING
  ============================ */
  const [notifications, setNotifications] = useState(0);

  const fetchOrders = async (isPolling = false) => {
    try {
      const res = await API.get("/agent/orders");
      const allOrders = res.data;

      const active = allOrders.filter(o => o.deliveryStatus !== "Delivered");
      const completed = allOrders
        .filter(o => o.deliveryStatus === "Delivered")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // Set state
      setActiveDeliveries(prev => {
        // DETECT NEW ORDERS (Only if polling)
        if (isPolling) {
          const prevIds = new Set(prev.map(o => o._id));
          const newOrders = active.filter(o => !prevIds.has(o._id));

          if (newOrders.length > 0) {
            toast.success(`You have ${newOrders.length} new order(s)! 🚀`);
            setNotifications(n => n + newOrders.length);
            // Optional: Play a sound here
          }
        }
        return active;
      });

      setCompletedOrders(completed);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    // 1. Initial Fetch
    fetchOrders(false);
    API.get("/agent/status")
      .then(res => setIsOnline(res.data.isAvailable))
      .catch(console.error);

    // 2. Polling every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (orderId) => {
    const order = activeDeliveries.find(o => o._id === orderId);
    console.log("Navigating for order:", order);
    if (!order?.address) return toast.error("Address not found");

    const address = `${order.address.street}, ${order.address.city}, ${order.address.zipCode || ''}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
  };

  const handleCall = (orderId) => {
    const order = activeDeliveries.find(o => o._id === orderId);
    // Prioritize phone from delivery address, then user profile
    const phoneNumber = order?.address?.phone || order?.user?.phone;

    console.log("Calling number:", phoneNumber);
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleToggleOnline = async () => {
    try {
      const res = await toggleAgentStatus();
      setIsOnline(res.data.isAvailable);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Failed to toggle status", err);
      toast.error("Failed to update status");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      setActiveDeliveries((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, deliveryStatus: newStatus } : o
        )
      );

      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };



  const handleCompleteDelivery = async (orderId) => {
    try {
      await API.put(`/agent/orders/${orderId}/delivered`);

      setActiveDeliveries((prev) =>
        prev.filter((o) => o._id !== orderId)
      );

      // Re-fetch orders to update history seamlessly or manually add to history (simpler to re-fetch/move)
      API.get("/agent/orders")
        .then(res => {
          const active = res.data.filter(o => o.deliveryStatus !== "Delivered");
          const completed = res.data.filter(o => o.deliveryStatus === "Delivered");
          setActiveDeliveries(active);
          setCompletedOrders(completed);
        });

      toast.success("Order delivered successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete delivery");
    }
  };

  const handleCollectPayment = async (orderId, method) => {
    try {
      await API.post(`/orders/${orderId}/pay`, {
        collectionMethod: method
      });

      setActiveDeliveries((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, isPaid: true } : o
        )
      );

      toast.success(`Payment collected via ${method}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment status");
    }
  };


  const selectedOrder = activeDeliveries.find(
    (o) => o._id === selectedOrderForStatus
  );

  const selectedOrderDetails = activeDeliveries.find(
    (o) => o._id === selectedOrderForDetails
  );


  const totalEarningsToday = completedOrders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const weekEarnings = totalEarningsToday; // Assuming daily for now, can be improved later
  const completedToday = completedOrders.length;


  const avgTimeMinutes = completedOrders.length > 0
    ? Math.round(completedOrders.reduce((acc, order) => {
      const start = new Date(order.createdAt);
      const end = new Date(order.updatedAt);
      const diffMins = (end - start) / (1000 * 60);
      return acc + diffMins;
    }, 0) / completedOrders.length)
    : 0;

  const averageTimeDisplay = completedOrders.length > 0 ? `${avgTimeMinutes} min` : "0 min";


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      <AgentHeader
        agent={user}
        isOnline={isOnline}
        notifications={notifications}
        onToggleOnline={handleToggleOnline}
        onNotifications={() => {
          setNotifications(0);
          toast.info("Notifications cleared");
        }}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      />


      {/* CONTENT WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <EarningsCard
              todayEarnings={totalEarningsToday}
              weekEarnings={weekEarnings}
              deliveriesToday={completedToday}
            />
          </motion.div>

          <div className="lg:col-span-2 flex flex-col h-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatsGrid
                activeOrders={activeDeliveries.length}
                averageTime={averageTimeDisplay}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1"
            >
              <ServiceStatusCard isOnline={isOnline} />
            </motion.div>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="active">
          <TabsList className="grid grid-cols-2 w-full max-w-sm mb-8">
            <TabsTrigger value="active">
              Active Deliveries ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* ACTIVE */}
          <TabsContent value="active">
            {activeDeliveries.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {activeDeliveries.map((order, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      key={order._id}
                      className="cursor-pointer"
                      onClick={() => setSelectedOrderForDetails(order._id)}
                    >
                      <DeliveryCard
                        order={order}
                        onCompleteDelivery={() =>
                          handleCompleteDelivery(order._id)
                        }
                        onNavigate={() => handleNavigate(order._id)}
                        onCall={() => handleCall(order._id)}
                        onUpdateStatus={() =>
                          setSelectedOrderForStatus(order._id)
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className={`p-6 rounded-full bg-blue-50 mb-6 ${isOnline ? 'animate-pulse' : ''}`}>
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No active deliveries</h3>
                <p className="text-gray-500 mb-6 max-w-sm text-center">
                  {isOnline
                    ? "You are online and creating presence! New orders will pop up here instantly."
                    : "You are currently offline. Go online to start receiving delivery requests."}
                </p>
                {!isOnline && (
                  <button
                    onClick={handleToggleOnline}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    Go Online Now
                  </button>
                )}
              </div>
            )}
          </TabsContent>

          {/* HISTORY */}
          <TabsContent value="history">
            {completedOrders.length > 0 ? (
              <OrderHistory orders={completedOrders} />
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-100 mt-4">
                <p className="text-gray-500 font-medium">No recent deliveries</p>
                <p className="text-sm text-gray-400 mt-1">
                  Completed orders will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* STATUS DIALOG */}
      {selectedOrder && (
        <StatusUpdateDialog
          open={selectedOrderForStatus !== null}
          onOpenChange={(open) =>
            !open && setSelectedOrderForStatus(null)
          }
          currentStatus={selectedOrder.deliveryStatus || selectedOrder.status}
          orderId={selectedOrder.id}
          isPaid={selectedOrder.isPaid}
          paymentMethod={selectedOrder.paymentMethod}
          onUpdateStatus={(newStatus) => {
            handleUpdateStatus(selectedOrder._id, newStatus);
            setSelectedOrderForStatus(null);
          }}
          onCollectPayment={async (method) => {
            await handleCollectPayment(selectedOrder._id, method);
          }}
        />
      )}

      {/* DETAILS DIALOG */}
      {selectedOrderDetails && (
        <DeliveryDetailsDialog
          open={selectedOrderForDetails !== null}
          onOpenChange={(open) =>
            !open && setSelectedOrderForDetails(null)
          }
          order={selectedOrderDetails}
          onNavigate={() =>
            handleNavigate(selectedOrderDetails._id)
          }
          onCall={() => handleCall(selectedOrderDetails._id)}
          onUpdateStatus={() => {
            setSelectedOrderForDetails(null);
            setSelectedOrderForStatus(selectedOrderDetails._id);
          }}
        />
      )}
    </div>
  );

}
