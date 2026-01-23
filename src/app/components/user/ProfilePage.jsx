import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Award,
  ShoppingBag,
  Heart,
  Pencil,
  Trash2,
  Star,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { isValidEmail, isValidPhone } from '../../../utils/validation';

export function ProfilePage({
  isDietMode,
  user,
  favorites,
  foodItems,
  onLogout,
  onCustomize,
}) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [tempProfileData, setTempProfileData] = useState(profileData);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filterTime, setFilterTime] = useState("All");

  const filteredOrders = orders.filter(o => {
    if (filterTime === "All") return true;

    const orderDate = new Date(o.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (filterTime === "7 Days") return diffDays <= 7;
    if (filterTime === "30 Days") return diffDays <= 30;
    return true;
  });

  const favoriteItems = foodItems.filter(item =>
    favorites.includes(item.id)
  );
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(false);


  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    label: "Home",
  });

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => { },
  });

  /* ---------------- Fetch Profile ---------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

        setTempProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

        // Deduplicate addresses and filter invalid ones
        const uniqueAddresses = Array.from(
          new Map(
            (data.addresses || [])
              .filter(item => item._id) // Remove items with no ID
              .map((item) => [String(item._id), item]) // Ensure string comparison
          ).values()
        );
        setAddresses(uniqueAddresses);

        setNotifications(
          data.notifications || {
            orderUpdates: true,
            offers: true,
            recommendations: true,
            newRestaurants: true,
            walletUpdates: true,
            systemAlerts: true,
          }
        );

        setPrivacy(
          data.privacySettings || {
            showEmail: false,
            showPhone: false,
            twoFactorAuth: false,
          }
        );

        const methods = data.paymentMethods || [];
        const hasCOD = methods.some(m => m.type === "COD");
        if (!hasCOD) {
          methods.unshift({ type: "COD", label: "Cash on Delivery", isDefault: methods.length === 0 });
        }
        setPaymentMethods(methods);

      });
  }, []);

  useEffect(() => {
    if (activeModal === "orders") {
      fetch("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            console.error("Orders fetch failed:", data);
            setOrders([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch orders:", err);
          setOrders([]);
        });
    }
  }, [activeModal]);

  useEffect(() => {
    if (activeModal === "redeem") {
      setLoadingPoints(true);
      fetch("http://localhost:5000/api/profile/redeem-points", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setRedeemPoints(data.points || 0);
          setLoadingPoints(false);
        })
        .catch(() => setLoadingPoints(false));
    }
  }, [activeModal]);


  const cancelOrder = (id) => {
    setConfirmation({
      isOpen: true,
      message: "Do you really want to cancel this order? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Failed to cancel");
          }

          const updated = await res.json();
          // Update local state
          setOrders(prev => prev.map(o => o._id === id ? updated.order : o));
          alert("Order cancelled successfully. Refunds will be processed to wallet if applicable.");
        } catch (error) {
          console.error("Cancel failed:", error);
          alert(error.message);
        }
      },
    });
  };

  /* ---------------- Save Profile ---------------- */
  const saveProfile = async () => {
    if (!isValidEmail(tempProfileData.email)) {
      alert("Please enter a valid email");
      return;
    }
    if (tempProfileData.phone && !isValidPhone(tempProfileData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...tempProfileData,
        addresses,
        notifications,
        privacySettings: privacy,
        paymentMethods,
      }),
    });

    const data = await res.json();
    setProfileData(data);
    setTempProfileData({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    setActiveModal(null);
  };

  /* ---------------- Address Helpers ---------------- */
  const addAddress = async () => {
    // Validation
    const required = ["fullName", "phone", "house", "street", "city", "state", "pincode"];
    for (const field of required) {
      if (!newAddress[field] || !newAddress[field].trim()) {
        alert("Please fill all fields");
        return;
      }
    }

    if (!isValidPhone(newAddress.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const proceedWithSave = async () => {
      // ... (save logic)
      const res = await fetch("http://localhost:5000/api/profile/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAddress),
      });

      const updated = await res.json();
      setAddresses(
        Array.from(
          new Map(
            updated
              .filter(item => item._id)
              .map((item) => [String(item._id), item])
          ).values()
        )
      );
      setEditingId(null);
      setNewAddress({
        fullName: "",
        phone: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        label: "Home",
      });
    };

    if (editingId) {
      setConfirmation({
        isOpen: true,
        message: "Do you want to update this address with the new details?",
        onConfirm: proceedWithSave,
      });
    } else {
      proceedWithSave();
    }
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a._id === id }))
    );
  };

  const deleteAddress = (id) => {
    setConfirmation({
      isOpen: true,
      message: "Do you really want to delete this address? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/profile/address/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!res.ok) throw new Error("Failed to delete");
          const updated = await res.json();
          setAddresses(
            Array.from(
              new Map(
                updated
                  .filter(item => item._id)
                  .map((item) => [String(item._id), item])
              ).values()
            )
          );
        } catch (error) {
          console.error("Delete failed:", error);
          alert("Failed to delete address");
        }
      },
    });
  };

  const editAddress = (addr) => {
    setConfirmation({
      isOpen: true,
      message: "Do you want to edit this address?",
      onConfirm: () => {
        setNewAddress(addr);
        setEditingId(addr._id);
      },
    });
  };

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addingMethod, setAddingMethod] = useState(null);
  const [newCard, setNewCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [newUPI, setNewUPI] = useState("");

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    recommendations: true,
    newRestaurants: true,
    walletUpdates: true,
    systemAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    twoFactorAuth: false,
  });

  /*useEffect(() => {
    if (activeModal === "favorites") {
      fetch("http://localhost:5000/api/profile/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(setFavorites);
    }
  }, [activeModal]);*/

  return (
    <div className="pb-20">
      {/* ---------------- Header ---------------- */}
      <motion.div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold"
            style={{
              background: isDietMode
                ? "linear-gradient(135deg, var(--food-green), var(--food-light-green))"
                : "linear-gradient(135deg, var(--food-red), var(--food-orange))",
            }}
          >
            {profileData.name?.split(" ").map((n) => n[0]).join("")}
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-extrabold">{profileData.name}</h1>
            <p className="text-sm text-gray-500">{profileData.email}</p>
            <p className="text-xs text-gray-400">{profileData.phone}</p>
          </div>

          <button
            onClick={() => setActiveModal("profile")}
            className="px-4 py-2 rounded-lg border text-sm font-semibold"
          >
            Edit
          </button>
        </div>
      </motion.div>

      {/* ---------------- Settings ---------------- */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <SettingButton icon={<User />} title="Personal Information" subtitle="Update your details" onClick={() => setActiveModal("profile")} />
        <SettingButton icon={<MapPin />} title="Delivery Addresses" subtitle="Manage your addresses" onClick={() => setActiveModal("address")} />
        <SettingButton icon={<CreditCard />} title="Payment Methods" subtitle="Manage payment" onClick={() => setActiveModal("payment")} />
        <SettingButton icon={<Bell />} title="Notifications" subtitle="Manage notifications" onClick={() => setActiveModal("notifications")} />
        <SettingButton icon={<Shield />} title="Privacy & Security" subtitle="Control your data" onClick={() => setActiveModal("privacy")} />
        <SettingButton icon={<ShoppingBag />} title="Order History" subtitle="Your orders" onClick={() => setActiveModal("orders")} />
        <SettingButton icon={<Heart />} title="Favorites" subtitle="Saved items" onClick={() => setActiveModal("favorites")} />
        <SettingButton icon={<Award />} title="Redeem Points" subtitle="Use reward points" onClick={() => setActiveModal("redeem")} />
      </div>

      {/* ---------------- Logout ---------------- */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          onLogout();
        }}
        className="mt-5 w-full bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4 hover:bg-red-50"
      >
        <LogOut className="text-red-600" />
        <p className="font-semibold text-red-600">Logout</p>
      </button>

      {/* ---------------- Modals ---------------- */}
      <AnimatePresence>
        {/* Personal Info */}
        {activeModal === "profile" && (
          <Modal key="profile-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout title="Personal Information" onCancel={() => setActiveModal(null)} onSave={saveProfile}>
              {["name", "email", "phone"].map((field) => (
                <input
                  key={field}
                  value={tempProfileData[field]}
                  onChange={(e) =>
                    setTempProfileData({ ...tempProfileData, [field]: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border"
                  placeholder={field}
                />
              ))}
            </ModalLayout>
          </Modal>
        )}

        {/* Delivery Addresses */}
        {activeModal === "address" && (
          <Modal key="address-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout title="Delivery Addresses" onCancel={() => setActiveModal(null)}>
              {/* Force HMR Freshness */}
              {addresses.map((a, idx) => (
                <div key={`address-${a._id || idx}`} className="p-4 border rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{a.fullName}</p>
                      <p className="text-xs text-gray-500">{a.label}</p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => editAddress(a)} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => deleteAddress(a._id)} title="Delete" className="text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm">{a.phone}</p>
                  <p className="text-sm">
                    {a.house}, {a.street}
                  </p>
                  <p className="text-sm">
                    {a.city}, {a.state} - {a.pincode}
                  </p>

                  {a.isDefault ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Star size={14} /> Default
                    </span>
                  ) : (
                    <button onClick={() => setDefaultAddress(a._id)} className="text-xs text-blue-600 flex items-center gap-1">
                      <Star size={14} /> Set Default
                    </button>
                  )}
                </div>
              ))}

              <h4 className="font-semibold pt-4">Add New Address</h4>

              {["fullName", "phone", "house", "street", "city", "state", "pincode"].map(
                (key) => (
                  <input
                    key={key}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    value={newAddress[key] || ""}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [key]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border"
                  />
                )
              )}

              <select
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>

              <button onClick={addAddress} className="w-full py-3 bg-red-500 text-white rounded-xl">
                {editingId ? "Update Address" : "Add Address"}
              </button>
            </ModalLayout>
          </Modal>
        )}

        {activeModal === "payment" && (
          <Modal key="payment-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout
              title="Payment Methods"
              onCancel={() => setActiveModal(null)}
              onSave={saveProfile}
            >
              <div className="space-y-3">
                {paymentMethods.map((pm, idx) => (
                  <div
                    key={pm._id || idx}
                    className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer ${pm.isDefault ? "border-red-500 bg-red-50" : ""
                      }`}
                    onClick={() =>
                      setPaymentMethods(prev =>
                        prev.map(p => ({ ...p, isDefault: p === pm }))
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      {pm.type === "UPI" ? (
                        <Smartphone className="text-green-600" />
                      ) : (
                        <CreditCard className="text-gray-600" />
                      )}

                      <div>
                        <p className="font-semibold">{pm.label}</p>
                        {pm.type === "CARD" && pm.cardNumber && (
                          <p className="text-xs text-gray-500">
                            **** {pm.cardNumber.slice(-4)}
                          </p>
                        )}
                        {pm.type === "UPI" && pm.upiId && (
                          <p className="text-xs text-gray-500">{pm.upiId}</p>
                        )}
                        {pm.isDefault && (
                          <p className="text-xs text-green-600">Default</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pm.isDefault && <Star size={16} className="text-yellow-500" />}
                      {pm.type !== "COD" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentMethods(prev => prev.filter(p => p !== pm));
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Method Selection */}
              {!addingMethod && (
                <div className="pt-4">
                  <button
                    onClick={() => setAddingMethod("upi")}
                    className="w-full flex flex-col items-center justify-center p-4 border border-dashed rounded-xl hover:bg-gray-50 text-gray-500"
                  >
                    <Smartphone className="mb-2" />
                    <span className="text-xs font-semibold">Add UPI ID</span>
                  </button>
                </div>
              )}



              {/* UPI Form */}
              {addingMethod === "upi" && (
                <div className="pt-4 space-y-3 bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-sm">Add New UPI</h4>
                  <input
                    placeholder="UPI ID (e.g. user@okaxis)"
                    value={newUPI}
                    onChange={(e) => setNewUPI(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setAddingMethod(null)} className="px-3 py-1.5 text-xs text-gray-500">Cancel</button>
                    <button
                      onClick={() => {
                        if (!newUPI.includes("@")) return alert("Invalid UPI ID");
                        setPaymentMethods([...paymentMethods, {
                          type: "UPI",
                          label: "UPI ID",
                          upiId: newUPI,
                          isDefault: paymentMethods.length === 0
                        }]);
                        setAddingMethod(null);
                        setNewUPI("");
                      }}
                      className="px-3 py-1.5 text-xs bg-black text-white rounded-lg"
                    >
                      Add UPI
                    </button>
                  </div>
                </div>
              )}

            </ModalLayout>
          </Modal>
        )}
        {activeModal === "notifications" && (
          <Modal key="notifications-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout
              title="Notifications"
              onCancel={() => setActiveModal(null)}
              onSave={saveProfile}
            >
              {[
                ["orderUpdates", "Order updates"],
                ["offers", "Offers & discounts"],
                ["recommendations", "Food recommendations"],
                ["newRestaurants", "New restaurants"],
                ["walletUpdates", "Wallet & refunds"],
                ["systemAlerts", "System alerts"],
              ].map(([key, label]) => (
                <div key={key} className="flex justify-between items-center">
                  <p className="font-medium">{label}</p>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [key]: !notifications[key],
                      })
                    }
                    className={`w-12 h-6 rounded-full relative transition ${notifications[key] ? "bg-green-500" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${notifications[key] ? "translate-x-6" : ""
                        }`}
                    />
                  </button>
                </div>
              ))}
            </ModalLayout>
          </Modal>
        )}

        {activeModal === "privacy" && (
          <Modal key="privacy-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout
              title="Privacy & Security"
              onCancel={() => setActiveModal(null)}
              onSave={saveProfile}
            >
              {/* Show Email */}
              <ToggleRow
                label="Show email to others"
                value={privacy.showEmail}
                onChange={() =>
                  setPrivacy({ ...privacy, showEmail: !privacy.showEmail })
                }
              />

              {/* Show Phone */}
              <ToggleRow
                label="Show phone number"
                value={privacy.showPhone}
                onChange={() =>
                  setPrivacy({ ...privacy, showPhone: !privacy.showPhone })
                }
              />

              {/* Two Factor Auth */}
              <ToggleRow
                label="Two-factor authentication"
                value={privacy.twoFactorAuth}
                onChange={() =>
                  setPrivacy({ ...privacy, twoFactorAuth: !privacy.twoFactorAuth })
                }
              />

              {/* Logout All Devices */}
              <button
                onClick={async () => {
                  await fetch("http://localhost:5000/api/profile", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ tokenVersion: Date.now() }),
                  });
                  alert("Logged out from all devices");
                }}
                className="w-full py-3 border rounded-xl text-red-600"
              >
                Logout from all devices
              </button>
            </ModalLayout>
          </Modal>
        )}

        {activeModal === "orders" && (
          <Modal key="orders-modal" onClose={() => setActiveModal(null)}>
            <div className="flex flex-col h-full max-h-[85vh]">
              <div className="p-6 border-b pb-4">
                <h3 className="text-lg font-extrabold mb-4">Order History</h3>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {["All", "7 Days", "30 Days"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterTime(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterTime === f
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto scrollbar-gutter-stable space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No orders found for this period</p>
                  </div>
                ) : (
                  filteredOrders.map((o, idx) => (
                    <div key={o._id || idx} className="p-4 border rounded-xl bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                        <div>
                          <p className="font-bold text-lg">₹{o.totalAmount}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded textxs font-semibold ${(o.deliveryStatus === "Delivered" || o.status === "Delivered")
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-50 text-blue-600"
                              }`}>
                              {/* Show delivery status if active/completed, else kitchen status */}
                              {o.deliveryStatus && o.deliveryStatus !== "Unassigned"
                                ? o.deliveryStatus
                                : o.status}
                            </span>
                            <p className="text-xs text-gray-400">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {/* Track/Cancel button logic */}
                        <div className="flex gap-2">
                          {o.status === "Placed" && (
                            <button
                              onClick={() => cancelOrder(o._id)}
                              className="px-3 py-1.5 bg-red-100 text-red-600 text-xs rounded-lg font-bold shadow-sm hover:bg-red-200 transition"
                            >
                              Cancel
                            </button>
                          )}

                          {o.deliveryStatus !== "Delivered" && o.status !== "Delivered" && o.status !== "Cancelled" && (
                            <button
                              onClick={() => window.location.href = `/tracking/${o._id}`}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold shadow-sm hover:bg-blue-700 transition"
                            >
                              Track
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {o.items?.map((item, idx) => {
                          // Robust Image Fallback:
                          // 1. Try populated food image
                          // 2. Try matching by name in global foodItems
                          // 3. Fallback placeholder
                          let imageUrl = item.food?.image;
                          if (!imageUrl) {
                            const foundFood = foodItems.find(f => f.name === item.name);
                            imageUrl = foundFood?.image;
                          }
                          if (!imageUrl) imageUrl = "https://placehold.co/100?text=Food";

                          // Ensure URL is absolute
                          if (imageUrl && !imageUrl.startsWith("http")) {
                            imageUrl = `http://localhost:5000${imageUrl}`;
                          }

                          return (
                            <div
                              key={idx}
                              className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition group"
                              onClick={() => {
                                // Pass the correct food object for customization
                                const foodDetails = item.food || foodItems.find(f => f.name === item.name);

                                if (foodDetails && onCustomize) {
                                  onCustomize({
                                    ...foodDetails,
                                    id: foodDetails._id || foodDetails.id // Handle different ID fields
                                  });
                                }
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-semibold text-sm text-gray-900 group-hover:text-red-500 transition-colors">
                                    {item.name}
                                  </p>
                                  <ChevronRight size={16} className="text-gray-300 group-hover:text-red-400" />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.qty} x ₹{item.price}
                                  {item.customizations?.ingredients?.length > 0 && (
                                    <span className="ml-1 text-gray-400">
                                      (+{item.customizations.ingredients.length} extras)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Modal>
        )}

        {activeModal === "favorites" && (
          <Modal key="favorites-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout title="Favorites" onCancel={() => setActiveModal(null)}>
              {favoriteItems.length === 0 ? (
                <p className="text-gray-500">No favorites yet</p>
              ) : (
                favoriteItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group"
                    onClick={() => {
                      if (onCustomize) {
                        onCustomize(item);
                        setActiveModal(null);
                      }
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="font-semibold group-hover:text-red-500 transition-colors">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </ModalLayout>
          </Modal>
        )}

        {activeModal === "redeem" && (
          <Modal key="redeem-modal" onClose={() => setActiveModal(null)}>
            <ModalLayout title="Redeem Points" onCancel={() => setActiveModal(null)}>
              {loadingPoints ? (
                <p className="text-center text-gray-500">Loading points...</p>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <p className="text-sm text-gray-500">Available Points</p>
                    <p className="text-4xl font-extrabold text-green-600">
                      {redeemPoints}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 text-center">
                    🎁 You earn points only after <b>successful delivery</b>
                  </p>

                  <p className="text-xs text-gray-500 text-center">
                    10 points = ₹10 discount
                  </p>

                  <button
                    disabled={redeemPoints === 0}
                    className="w-full py-3 bg-red-500 text-white rounded-xl disabled:opacity-50"
                    onClick={() => {
                      setActiveModal(null);
                      navigate("/checkout", { state: { redeem: true } });
                    }}
                  >
                    Use Points at Checkout
                  </button>
                </div>
              )}
            </ModalLayout>
          </Modal>
        )}

        {/* ---------------- Confirmation Modal ---------------- */}
        {confirmation.isOpen && (
          <Modal key="confirmation-modal" onClose={() => setConfirmation({ ...confirmation, isOpen: false })}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">Are you sure?</h3>
              <p className="text-gray-500 mb-6">{confirmation.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmation({ ...confirmation, isOpen: false })}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmation.onConfirm();
                    setConfirmation({ ...confirmation, isOpen: false });
                  }}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-bold text-white hover:bg-red-600 shadow-lg shadow-red-200"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Modal>
        )}

      </AnimatePresence>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function SettingButton({ icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6 scrollbar-gutter-stable">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}


function ModalLayout({ title, children, onCancel, onSave }) {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-extrabold mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
      <div className="pt-4 flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 border rounded-lg">
          Cancel
        </button>
        {onSave && (
          <button onClick={onSave} className="px-4 py-2 bg-red-500 text-white rounded-lg">
            Save
          </button>
        )}
      </div>
    </div>
  );
}


function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <p className="font-medium">{label}</p>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full relative transition ${value ? "bg-green-500" : "bg-gray-300"
          }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${value ? "translate-x-6" : ""
            }`}
        />
      </button>
    </div>
  );
}
