import { useState } from "react";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CustomizationPanel } from "../CustomizationPanel";

export function CartPage({ isDietMode, user, cartItems, setCartItems }) {
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState(null);

  /* ---------------- SYNC CART WITH BACKEND ---------------- */
  const syncCart = async (items) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          items,
        }),
      });
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  };

  /* ---------------- CART ACTIONS ---------------- */
  const increaseQty = (id) => {
    setCartItems((prev) => {
      const updated = prev.map((i) =>
        i.item.id === id ? { ...i, qty: i.qty + 1 } : i
      );
      syncCart(updated);
      return updated;
    });
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => {
      const updated = prev
        .map((i) =>
          i.item.id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0);
      syncCart(updated);
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.item.id !== id);
      syncCart(updated);
      return updated;
    });
  };

  const handleUpdateCartItem = (foodItem, customizations) => {
    setCartItems((prev) => {
      const updated = prev.map((cartEntry) => {
        // Use strict reference check to update ONLY the item being edited
        if (cartEntry === editingItem) {
          return {
            ...cartEntry,
            qty: customizations.quantity,
            customizations: {
              ingredients: customizations.ingredients,
              portionSize: customizations.portionSize
            }
          };
        }
        return cartEntry;
      });
      syncCart(updated);
      return updated;
    });
    setEditingItem(null);
  };

  /* ---------------- TOTAL ---------------- */
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.item.price * i.qty,
    0
  );

  /* ---------------- UI ---------------- */
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <ArrowLeft className="mx-auto mb-2" />
        <p>Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.item.id}
            onClick={() => setEditingItem(item)}
            className="flex items-center bg-white p-3 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <img
              src={item.item.image}
              alt={item.item.name}
              className="w-20 h-20 object-cover rounded-xl"
            />

            <div className="flex-1 ml-3">
              <h3 className="font-semibold">{item.item.name}</h3>

              {item.customizations?.ingredients?.length > 0 && (
                <p className="text-sm text-gray-500">
                  + {item.customizations.ingredients.join(", ")}
                </p>
              )}

              <p className="text-sm font-semibold mt-1">
                ₹{(item.item.price * item.qty).toFixed(2)}
              </p>
            </div>

            <div
              className="flex flex-col items-center gap-2 ml-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1">
                <button onClick={() => decreaseQty(item.item.id)}>
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button onClick={() => increaseQty(item.item.id)}>
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.item.id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-xl shadow flex justify-between">
        <span>Total</span>
        <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className={`mt-4 w-full py-3 rounded-xl text-white font-semibold ${isDietMode ? "bg-green-500" : "bg-red-500"
          }`}
      >
        Checkout
      </button>
      {editingItem && (
        <CustomizationPanel
          item={editingItem.item}
          isDietMode={isDietMode}
          onClose={() => setEditingItem(null)}
          onAddToCart={handleUpdateCartItem}
          initialValues={{
            ingredients: editingItem.customizations?.ingredients || [],
            portionSize: editingItem.customizations?.portionSize || 'regular',
            quantity: editingItem.qty
          }}
        />
      )}
    </div>
  );
}
