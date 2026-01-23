import { Star, Plus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function FoodCard({
  item,
  isDietMode,
  onAddToCart,
  onCustomize,
  isFavorite,
  onToggleFavorite = () => { },
  onShowReviews,
}) {

  return (
    <motion.div
      className="relative group flex-shrink-0 w-[160px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={(e) => {
        // prevent opening customize when clicking heart
        if (e.target.closest(".favorite-btn")) return;
        // prevent opening customize when clicking reviews
        if (e.target.closest(".review-trigger")) return;

        // Prevent opening customization if item is unavailable
        if (!item.isAvailable) return;

        onCustomize?.(item);
      }}
    >


      {/* UNAVAILABLE OVERLAY */}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-gray-900/60 z-10 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300">
          <div className="bg-black/80 text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full border border-white/20 shadow-xl uppercase">
            Unavailable
          </div>
        </div>
      )}

      <img
        src={item.image}
        alt={item.name}
        className={`w-full object-cover transition-all duration-300 ${!item.isAvailable ? "grayscale contrast-125" : ""}`}
        style={{ height: isDietMode ? '100px' : '120px' }}
      />

      {item.isAvailable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className="
            favorite-btn
            absolute top-2 right-2
            bg-white/90 p-1.5 rounded-full shadow
            opacity-0 scale-90
            group-hover:opacity-100 group-hover:scale-100
            transition-all duration-200
            z-20
          "
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      )}


      <div className={`p-2.5 ${!item.isAvailable ? "opacity-60" : ""}`}>
        <div className="flex items-start gap-2 mb-1">
          <h3 className="text-[14px] font-[600] text-gray-800 flex-1">
            {item.name}
          </h3>

          {isDietMode && item.isHealthy && (
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-lg text-[10px] font-[600]">
              ✓
            </span>
          )}
        </div>

        <button
          className="review-trigger flex items-center gap-1 mb-1 hover:bg-gray-100 p-1 -ml-1 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onShowReviews?.(item);
          }}
        >
          <Star className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
          <span className="text-[11px] text-gray-600">
            {item.reviews > 0 ? item.rating?.toFixed(1) : "New"} ({item.reviews || 0} reviews)
          </span>
        </button>

        {isDietMode && (
          <div className="text-[10px] text-gray-600 mb-1">
            {item.calories} cal • {item.protein}g protein
          </div>
        )}

        <div className="flex items-center justify-between">
          <span
            className="text-[14px] font-[700]"
            style={{
              color: isDietMode ? 'var(--food-green)' : 'var(--food-red)',
            }}
          >
            ₹{item.price.toFixed(2)}
          </span>

          <button
            disabled={!item.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (item.isAvailable) onAddToCart(item);
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${!item.isAvailable
              ? "bg-gray-300 cursor-not-allowed"
              : ""
              }`}
            style={item.isAvailable ? {
              backgroundColor: isDietMode
                ? 'var(--food-green)'
                : 'var(--food-red)',
              color: 'white',
            } : {}}
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );

}
