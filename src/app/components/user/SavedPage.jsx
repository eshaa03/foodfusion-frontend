import { useState } from 'react';
import { Heart, Star, Clock, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SavedPage({ isDietMode, onAddToCart, favorites = [], foodItems = [], onCustomize, onShowReviews }) {


  const savedItems = foodItems.filter(item => {
    if (!favorites.includes(item.id)) return false;

    // Mode filter (Strict) - matches UserApp.jsx logic
    const mode = item.mode || "both";
    if (isDietMode) {
      if (mode === "normal") return false;
      if (!item.isHealthy) return false;
    } else {
      if (mode === "diet") return false;
    }
    return true;
  });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(savedItems.map(item => item.category)))];

  const filteredItems = savedItems.filter(item =>
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleRemove = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ itemId: id }),
    });

    const updated = await res.json();
    // update parent-controlled favorites
    window.dispatchEvent(
      new CustomEvent("favorites-updated", { detail: updated })
    );
  };



  const handleAddToCart = (item) => {
    if (onAddToCart) {
      onAddToCart(item, 1);
    } else {
      alert(`Added ${item.name} to cart!`);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[24px] font-[800] text-gray-800 mb-1">Saved Items</h1>
        <p className="text-[14px] text-gray-600">Your favorite food items</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: isDietMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(226, 55, 68, 0.1)' }}
            >
              <Heart
                className="w-6 h-6"
                style={{
                  color: isDietMode ? 'var(--food-green)' : 'var(--food-red)',
                  fill: isDietMode ? 'var(--food-green)' : 'var(--food-red)'
                }}
              />
            </div>
            <div>
              <p className="text-[12px] text-gray-500">Total Saved</p>
              <p className="text-[20px] font-[800] text-gray-800">{savedItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: isDietMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(226, 55, 68, 0.1)' }}
            >
              <Star
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            </div>
            <div>
              <p className="text-[12px] text-gray-500">Avg Rating</p>
              <p className="text-[20px] font-[800] text-gray-800">
                {savedItems.length > 0
                  ? (savedItems.reduce((sum, item) => sum + item.rating, 0) / savedItems.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {savedItems.length > 0 && (
        <div className="flex gap-3 overflow-x-auto mb-5 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-[600] text-white transition-all whitespace-nowrap"
              style={{
                backgroundColor: selectedCategory === category
                  ? isDietMode ? 'var(--food-green)' : 'var(--food-red)'
                  : isDietMode ? 'var(--food-light-green)' : 'var(--food-yellow)',
                opacity: selectedCategory === category ? 1 : 0.8,
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Saved Items Grid */}
      <AnimatePresence mode="popLayout">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => onCustomize && onCustomize(item)}
              >
                <div className="flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover flex-shrink-0"
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-[700] text-gray-800">{item.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* <p className="text-[12px] text-gray-500 mb-1">{item.restaurant}</p> */}
                      <div
                        className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors -ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowReviews && onShowReviews(item);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[12px] font-[600]">{item.rating || "New"}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-[12px] text-gray-500">{item.category}</span>
                      </div>
                      {/* <p className="text-[11px] text-gray-400 mb-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Saved {item.savedDate}
                      </p> */}
                      <p className="text-[12px] text-gray-500 mb-1">
                        Category: {item.category}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[18px] font-[800]"
                        style={{ color: isDietMode ? 'var(--food-green)' : 'var(--food-red)' }}
                      >
                        ₹{item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="px-3 py-1.5 rounded-lg text-white text-[12px] font-[600] flex items-center gap-1 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: isDietMode ? 'var(--food-green)' : 'var(--food-red)' }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No saved items yet</p>
            <p className="text-[12px] text-gray-400">Start saving your favorite dishes!</p>
          </motion.div>
        )}
      </AnimatePresence>



      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
