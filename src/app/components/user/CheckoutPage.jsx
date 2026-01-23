import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import { isValidAddress, isValidPhone } from '../../../utils/validation';

export function CheckoutPage({ cartItems, user, isDietMode, setCartItems }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Form State for NEW Address
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    label: "Home"
  });

  // Selected Address for Order
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  /* ---------------- POINTS LOGIC ---------------- */
  const [availablePoints, setAvailablePoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);

  /* ---------------- Auto-select default address ---------------- */
  useEffect(() => {
    if (user?.addresses?.length) {
      setAddresses(user.addresses);

      const def = user.addresses.find(a => a.isDefault);
      if (def) {
        setSelectedAddressId(def._id);
        setDeliveryInfo({
          name: def.fullName,
          phone: def.phone,
          address: `${def.house}, ${def.street}, ${def.city}, ${def.state} - ${def.pincode}`,
        });
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setAddresses(data.addresses || []);
        setAvailablePoints(data.redeemPoints || 0);

        // auto-select default
        const def = data.addresses?.find(a => a.isDefault);
        if (def) {
          setSelectedAddressId(def._id);
          setDeliveryInfo({
            name: def.fullName,
            phone: def.phone,
            address: `${def.house}, ${def.street}, ${def.city}, ${def.state} - ${def.pincode}`,
          });
        }

        // Check if redirected from Profile with intent to redeem
        if (location.state?.redeem) {
          setUsePoints(true);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchAddresses();
  }, [location.state]);

  /* ---------------- CALCULATIONS ---------------- */
  const [promoCode, setPromoCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.qty,
    0
  );

  const pointsDiscount = usePoints ? Math.min(availablePoints, subTotal) : 0;

  // Calculate final total (ensure it doesn't go below 0)
  const finalTotal = Math.max(0, subTotal - pointsDiscount - couponDiscount);

  const handleApplyCoupon = async () => {
    // 1. Check eligibility (First Order Only)
    try {
      const res = await fetch("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const orders = await res.json();

      const isFirstOrder = orders.length <= 1; // Allow if 0 or 1 (current order not placed yet)
      // Actually, if we fetch orders, the current one isn't placed yet, so length should be 0.

      if (orders.length > 0) {
        alert("This coupon is only valid for your first order!");
        setCouponDiscount(0);
        return;
      }
    } catch (err) {
      console.error("Coupon check failed", err);
      // Fail open or closed? Closed for safety.
      alert("Could not verify coupon eligibility.");
      return;
    }

    if (promoCode === "FRESH50") {
      setCouponDiscount(subTotal * 0.50);
      alert("50% discount applied!");
    } else if (promoCode === "HEALTHY30") {
      setCouponDiscount(subTotal * 0.30);
      alert("30% discount applied!");
    } else {
      setCouponDiscount(0);
      alert("Invalid Code");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    // Validation
    if (!isValidPhone(deliveryInfo.phone)) {
      alert("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    if (!isValidAddress(deliveryInfo.address)) {
      alert("Please enter a complete address (at least 10 characters)");
      setLoading(false);
      return;
    }

    try {
      // 1. Format Address for Backward Compatibility / Schema Match
      const [house, street, city, statePincode] = deliveryInfo.address.split(",");
      const [state, pincode] = statePincode
        ? statePincode.split("-").map(s => s.trim())
        : ["", ""];

      const formattedAddress = {
        fullName: deliveryInfo.name,
        phone: deliveryInfo.phone,
        house: house?.trim() || "",
        street: street?.trim() || deliveryInfo.address, // fallback
        city: city?.trim() || "",
        state: state || "",
        pincode: pincode || "",
      };

      // 2. Fix Payment Enum
      const paymentMethodEnum = paymentMethod === "cod" ? "COD" : "UPI";

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cartItems.map(i => ({
            foodId: i.item._id,
            name: i.item.name,
            price: i.item.price,
            qty: i.qty,
          })),
          address: formattedAddress,
          paymentMethod: paymentMethodEnum,
          totalAmount: finalTotal,
          pointsToRedeem: pointsDiscount,
        }),
      });

      const order = await res.json();

      if (res.ok) {
        setTrackingCode(order._id);
        setCartItems([]);
        setOrderPlaced(true);
      } else {
        alert(order.message || "Order failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };


  const saveNewAddress = async () => {
    // Validation
    const required = ["fullName", "phone", "house", "street", "city", "state", "pincode"];
    for (const field of required) {
      if (!newAddress[field] || !newAddress[field].trim()) {
        alert(`Please enter ${field}`);
        return;
      }
    }

    if (!isValidPhone(newAddress.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const res = await fetch("http://localhost:5000/api/profile/address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newAddress),
    });

    const updatedAddresses = await res.json();

    // ✅ THIS is what refreshes UI
    setAddresses(updatedAddresses);

    // auto-select newly added address
    const last = updatedAddresses[updatedAddresses.length - 1];
    setSelectedAddressId(last._id);

    // Update active delivery info
    setDeliveryInfo({
      name: last.fullName,
      phone: last.phone,
      address: `${last.house}, ${last.street}, ${last.city}, ${last.state} - ${last.pincode}`,
    });

    setShowNewAddress(false);

    // Reset form
    setNewAddress({
      fullName: "",
      phone: "",
      house: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      label: "Home"
    });
  };




  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="p-4 text-center">
        <p>Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-xl font-semibold">{trackingCode}</p>

        <button
          onClick={() => navigate(`/tracking/${trackingCode}`)}
          className="mt-4 px-4 py-2 rounded bg-blue-500 text-white"
        >
          Track Order
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
      >
        ← Back
      </button>
      {/* ---------------- Cart Summary ---------------- */}
      <div className="mb-4 bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Your Items</h3>
        {cartItems.map(item => (
          <div key={item.cartId} className="flex justify-between mb-1">
            <span>{item.item.name} x {item.qty}</span>
            <span>₹{(item.item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-2 pt-2 border-t">
          <span>Subtotal</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>

        {/* Points Redemption UI */}
        {availablePoints > 0 && (
          <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={() => setUsePoints(!usePoints)}
                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-red-700">Redeem Points</p>
                <p className="text-xs text-red-500">
                  Use {availablePoints} points to save ₹{availablePoints}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Promo Code UI */}
        <div className="mt-3">
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Promo Code"
              className="flex-1 px-3 py-2 border rounded-lg text-sm uppercase"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold"
            >
              Apply
            </button>
          </div>
          {couponDiscount > 0 && (
            <p className="text-xs text-green-600 mt-1">Coupon Applied! You saved ₹{couponDiscount.toFixed(2)}</p>
          )}
        </div>

        {usePoints && pointsDiscount > 0 && (
          <div className="flex justify-between mt-2 text-green-600 font-medium">
            <span>Points Discount</span>
            <span>- ₹{pointsDiscount.toFixed(2)}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between mt-2 text-green-600 font-medium">
            <span>Coupon Discount</span>
            <span>- ₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between mt-4 font-bold text-lg pt-2 border-t border-dashed">
          <span>Final Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ---------------- Delivery Address ---------------- */}
      <div className="mb-4 bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Delivery Address</h3>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-3 mb-3">
            {addresses.map(addr => (
              <label
                key={addr._id}
                className={`flex gap-3 p-3 border rounded-xl cursor-pointer ${selectedAddressId === addr._id ? "border-red-500 bg-red-50" : ""
                  }`}
              >

                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr._id}
                  onChange={() => {
                    setSelectedAddressId(addr._id);
                    setDeliveryInfo({
                      name: addr.fullName,
                      phone: addr.phone,
                      address: `${addr.house}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
                    });
                    setShowNewAddress(false);
                  }}
                />

                <div>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                  <p className="text-sm text-gray-500">
                    {[addr.house, addr.street].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {[
                      [addr.city, addr.state].filter(Boolean).join(", "),
                      addr.pincode
                    ].filter(Boolean).join(" - ")}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Add New Address Toggle */}
        <button
          onClick={() => setShowNewAddress(!showNewAddress)}
          className="text-sm text-blue-600"
        >
          + Add new address
        </button>

        {/* New Address Form */}
        {showNewAddress && (
          <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="font-semibold text-sm">Add New Address</h4>

            <input
              placeholder="Full Name"
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="House / Flat No"
                value={newAddress.house}
                onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                placeholder="Street / Area"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>

            <button
              onClick={saveNewAddress}
              className="w-full mt-2 py-3 rounded-xl bg-red-500 text-white font-semibold
          hover:bg-red-600 active:scale-[0.98] transition"
            >
              Save Address
            </button>
          </div>
        )}
      </div>

      {/* ---------------- Payment ---------------- */}
      <div className="mb-4 bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="qr">Google Pay / UPI</option>
        </select>
      </div>

      {paymentMethod === "qr" && (
        <div className="mb-4 bg-white p-4 rounded-xl shadow text-center">
          <QRCode
            value={`upi://pay?pa=eshaafsal2004@oksbi&am=${finalTotal}`}
            size={200}
          />
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold ${isDietMode ? "bg-green-500" : "bg-red-500"
          }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
