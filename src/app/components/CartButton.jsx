import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function CartButton({
  itemCount,
  totalPrice,
  isDietMode,
}) {
  const navigate = useNavigate();

  const isDisabled = itemCount === 0;


  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={() => !isDisabled && navigate("/cart")}
      className={`fixed bottom-20 right-5 w-16 h-16 rounded-full shadow-2xl
                  text-white flex items-center justify-center z-40
                  ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
      style={{
        backgroundColor: isDietMode
          ? "var(--food-green)"
          : "var(--food-red)",
      }}
    >

      <ShoppingCart className="w-6 h-6" />

      <div
        className="absolute -top-1 -right-1 w-6 h-6 rounded-full
                   flex items-center justify-center text-[11px] font-bold"
        style={{ backgroundColor: "var(--food-yellow)", color: "#333" }}
      >
        {itemCount}
      </div>

      <div
        className="absolute -bottom-8 bg-white text-gray-800
                   px-3 py-1 rounded-full shadow-md
                   text-[12px] font-semibold whitespace-nowrap"
      >
        ₹{totalPrice.toFixed(2)}
      </div>
    </motion.button>
  );
}
