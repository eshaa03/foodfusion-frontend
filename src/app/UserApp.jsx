import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Compass, Heart, User, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Header } from "./components/Header";
import { FoodCard } from "./components/FoodCard";
import { CustomizationPanel } from "./components/CustomizationPanel";
import { ReviewsModal } from "./components/ReviewsModal";
import { CartButton } from "./components/CartButton";
import { AIRecommendations } from "./components/AIRecommendations";
import { Chatbot } from "./components/Chatbot";
import { DietFilters } from "./components/DietFilters";

import ExplorePage from "./components/user/ExplorePage";
import { SavedPage } from "./components/user/SavedPage";
import { ProfilePage } from "./components/user/ProfilePage";
import { CartPage } from "./components/user/CartPage";
import { CheckoutPage } from "./components/user/CheckoutPage";
import { OrderTrackingPage } from "./components/user/OrderTrackingPage";
import RestaurantFoodsPage from "./components/user/RestaurantFoodsPage";


const CATEGORIES = ["All", "Burgers", "Pizza", "Healthy", "Asian", "Mexican", "Italian"];

/* ---------------- COMPONENT ---------------- */

export function UserApp({ user, token, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [foods, setFoods] = useState([]);

  const [isDietMode, setIsDietMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilters, setSelectedFilters] = useState(new Set());
  const [normalFilters, setNormalFilters] = useState(new Set()); // vegetarian/vegan filters
  const [customizingItem, setCustomizingItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [budget, setBudget] = useState(2000); // Default to max to show all items
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  const [tasteProfile, setTasteProfile] = useState({
    categoryWeight: {},
    healthyPreference: 0,
  });

  const [reviewingItem, setReviewingItem] = useState(null);

  const handleToggleFilter = (filter) => {
    const f = new Set(selectedFilters);
    f.has(filter) ? f.delete(filter) : f.add(filter);
    setSelectedFilters(f);
  };

  const handleToggleNormalFilter = (filter) => {
    const f = new Set(normalFilters);
    f.has(filter) ? f.delete(filter) : f.add(filter);
    setNormalFilters(f);
  };

  const handleAddToCart = (item, customizations = {}, totalPrice) => {
    setTasteProfile(prev => ({
      categoryWeight: {
        ...prev.categoryWeight,
        [item.category]: (prev.categoryWeight[item.category] || 0) + 1,
      },
      healthyPreference: prev.healthyPreference + (item.isHealthy ? 1 : -0.5),
    }));

    setCartItems(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [
        ...prev,
        {
          cartId: crypto.randomUUID(),
          item: {
            id: item.id,
            name: item.name,
            image: item.image,
            price: totalPrice || item.price,
          },
          qty: 1,
          customizations,
        },
      ];
    });
  };

  /* ---------------- FILTERING LOGIC ---------------- */
  const filteredItems = foods.filter(item => {
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Category filter
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;

    // Mode filter (Strict)
    const mode = item.mode || "both";

    if (isDietMode) {
      return (mode === "diet" || mode === "both") && item.isHealthy;
    }

    return (mode === "normal" || mode === "both");


    // Normal vegetarian/vegan filters
    if (!isDietMode && normalFilters.size > 0) {
      if (normalFilters.has("Vegetarian") && !item.isVegetarian) return false;
      if (normalFilters.has("Vegan") && !item.isVegan) return false;
    }

    // Budget/Price Filter
    if (item.price > budget) return false;

    return true;
  });

  const recommendations = foods
    .filter(item => {
      // Search Filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // 🛡️ Strict Diet Mode Filter for Recommendations
      if (isDietMode && !item.isHealthy) return false;

      // Vegetarian/Vegan Filters
      if (!isDietMode && normalFilters.size > 0) {
        if (normalFilters.has("Vegetarian") && !item.isVegetarian) return false;
        if (normalFilters.has("Vegan") && !item.isVegan) return false;
      }
      return true;
    })
    .map(item => {
      let score = 0;
      if (item.price <= budget) score += 2;
      score += tasteProfile.categoryWeight[item.category] || 0;
      if (isDietMode && item.isHealthy) score += 1;
      if (!isDietMode && !item.isHealthy) score += 0.5;
      if (selectedCategory !== "All" && item.category === selectedCategory) score += 1.5;
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const totalCartPrice = cartItems.reduce((sum, i) => sum + i.item.price * i.qty, 0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/foods`)
      .then(res => res.json())
      .then(data => {
        // Safe check for array
        if (!Array.isArray(data)) {
          console.error("Expected array of foods but got:", data);
          setFoods([]);
          return;
        }

        // Normalize backend data
        const normalized = data.map(f => ({
          ...f,
          id: f._id,                 // frontend expects id
          price: f.basePrice,        // frontend uses price
          image: f.image?.startsWith("http")
            ? f.image
            : `${import.meta.env.VITE_API_URL}${f.image}`,
          isAvailable: f.isAvailable !== false, // Default to true if undefined
        }));

        setFoods(normalized);
        // build categories dynamically (removed state-based setCategories)
      })
      .catch(err => console.error("Failed to load foods", err));
  }, []);

  // Derive available categories based on current mode
  const availableCategories = ["All", ...Array.from(new Set(
    foods
      .filter(item => {
        // Same strict logic as filteredItems
        const mode = item.mode || "both";
        if (isDietMode) {
          if (mode === "normal") return false;
          if (!item.isHealthy) return false;
        } else {
          if (mode === "diet") return false;
        }
        return true;
      })
      .map(item => item.category)
  ))];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/profile/favorites`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setFavorites);
  }, []);

  const toggleFavorite = async (item) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ itemId: item.id }),
    });

    const updated = await res.json();
    setFavorites(updated);
  };

  const handleReviewUpdate = (foodId, newRating, newReviews) => {
    setFoods(prev => prev.map(f =>
      f.id === foodId
        ? { ...f, rating: newRating, reviews: newReviews }
        : f
    ));

    // Also update the reviewing item if it's the same
    if (reviewingItem && reviewingItem.id === foodId) {
      setReviewingItem(prev => ({ ...prev, rating: newRating, reviews: newReviews }));
    }
  };



  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: isDietMode ? "var(--food-bg-healthy)" : "var(--food-bg-normal)" }}>
      <Header isDietMode={isDietMode} onToggleMode={() => setIsDietMode(!isDietMode)} userName={user?.name} />

      <div className="flex-1 px-5 py-5 pb-20 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={
            <>
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl px-4 py-3 mb-5 shadow-sm flex items-center gap-3"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for food..."
                  className="flex-1 outline-none bg-transparent"
                />
              </motion.div>

              {/* Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-xl p-4 mb-5 text-white flex gap-4 shadow-md"
                style={{ backgroundColor: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
              >
                <div className="flex-1">
                  <h3 className="font-bold">{isDietMode ? "Healthy Choices 30% OFF!" : "50% OFF Your First Order!"}</h3>
                  <p className="text-sm opacity-90">{isDietMode ? "Use code: HEALTHY30" : "Use code: FRESH50"}</p>
                </div>
                <Tag />
              </motion.div>

              {/* Budget Slider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-gray-700">Max Budget</label>
                  <span className="text-sm font-bold px-2 py-1 rounded bg-gray-100">₹{budget}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="2000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: isDietMode ? "var(--food-green)" : "var(--food-red)",
                    background: `linear-gradient(
                      to right,
                      ${isDietMode ? "var(--food-green)" : "var(--food-red)"} 0%,
                      ${isDietMode ? "var(--food-green)" : "var(--food-red)"} ${((budget - 30) / (2000 - 30)) * 100
                      }%,
                      #e5e5e5 ${((budget - 30) / (2000 - 30)) * 100
                      }%,
                      #e5e5e5 100%
                    )`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>₹30</span>
                  <span>₹2000</span>
                </div>
              </motion.div>

              {/* Diet Filters */}
              {isDietMode && <DietFilters selectedFilters={selectedFilters} onToggleFilter={handleToggleFilter} isDietMode={isDietMode} />}

              {/* Normal filters */}
              {!isDietMode && (
                <div className="flex gap-3 overflow-x-auto mb-5">
                  {["Vegetarian", "Vegan"].map(f => {
                    const isSelected = normalFilters.has(f);
                    return (
                      <button
                        key={f}
                        onClick={() => handleToggleNormalFilter(f)}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer shadow-sm transition-colors duration-200`}
                        style={{
                          backgroundColor: isSelected ? "#4CAF50" : "#E6F4EA",
                          color: isSelected ? "white" : "#2E7D32",
                        }}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: isSelected ? "#1B5E20" : "white",
                            border: "1px solid #1B5E20",
                          }}
                        />
                        <span className="text-sm font-medium">{f}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Cuisine/Category Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-700">Cuisines</h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {availableCategories.map((c, i) => (
                    <motion.button
                      key={c}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (i * 0.05) }}
                      onClick={() => setSelectedCategory(c)}
                      className="px-4 py-2 rounded-full text-white flex-shrink-0 transition-all transform hover:scale-105"
                      style={{
                        backgroundColor: selectedCategory === c
                          ? (isDietMode ? "var(--food-green)" : "var(--food-red)")
                          : "var(--food-yellow)",
                        opacity: selectedCategory === c ? 1 : 0.8
                      }}
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <AIRecommendations
                recommendations={recommendations}
                isDietMode={isDietMode}
                onAddToCart={handleAddToCart}
                onCustomize={setCustomizingItem}
                budget={budget}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onShowReviews={setReviewingItem}
              />


              {/* Popular Near You */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">Popular Near You</h2>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-sm font-semibold"
                  style={{ color: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
                >
                  View All
                </button>
              </div>

              {/* Food Items */}
              <motion.div
                layout
                className="flex flex-wrap gap-4 justify-start"
              >
                <AnimatePresence>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, i) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        key={item.id}
                        className="flex-shrink-0"
                      >
                        <FoodCard
                          item={item}
                          isDietMode={isDietMode}
                          onAddToCart={handleAddToCart}
                          onCustomize={setCustomizingItem}
                          isFavorite={favorites.includes(item.id)}
                          onToggleFavorite={toggleFavorite}
                          onShowReviews={setReviewingItem}

                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full text-center py-10 text-gray-400 font-semibold"
                    >
                      No items available
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          } />

          <Route path="/explore" element={<ExplorePage isDietMode={isDietMode} onShowReviews={setReviewingItem} />} />
          <Route
            path="/saved"
            element={
              <SavedPage
                isDietMode={isDietMode}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                foodItems={foods}
                onCustomize={setCustomizingItem}
                onShowReviews={setReviewingItem}
              />

            }
          />

          <Route
            path="/profile"
            element={
              <ProfilePage
                isDietMode={isDietMode}
                user={user}
                favorites={favorites}
                foodItems={foods}
                onLogout={onLogout}
                onCustomize={setCustomizingItem}
                onShowReviews={setReviewingItem}
              />
            }
          />

          <Route
            path="/restaurant/:id"
            element={
              <RestaurantFoodsPage
                isDietMode={isDietMode}
                onAddToCart={handleAddToCart}
                onCustomize={setCustomizingItem}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onShowReviews={setReviewingItem}
              />
            }
          />

          <Route path="/cart" element={<CartPage isDietMode={isDietMode} user={user} cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/checkout" element={<CheckoutPage isDietMode={isDietMode} cartItems={cartItems} setCartItems={setCartItems} user={user} />} />
          <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />
        </Routes>
      </div>

      {customizingItem && (
        <CustomizationPanel item={customizingItem} isDietMode={isDietMode} onClose={() => setCustomizingItem(null)} onAddToCart={handleAddToCart} budget={budget} />
      )}

      {reviewingItem && (
        <ReviewsModal
          item={reviewingItem}
          onClose={() => setReviewingItem(null)}
          isDietMode={isDietMode}
          onUpdate={(rating, count) => handleReviewUpdate(reviewingItem.id, rating, count)}
        />
      )}

      <CartButton itemCount={cartItems.length} totalPrice={totalCartPrice} isDietMode={isDietMode} />
      <Chatbot isDietMode={isDietMode} />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-50">
        {[{ p: "/", i: Home }, { p: "/explore", i: Compass }, { p: "/saved", i: Heart }, { p: "/profile", i: User }].map(({ p, i: Icon }) => (
          <button key={p} onClick={() => navigate(p)} style={{ color: location.pathname === p ? (isDietMode ? "var(--food-green)" : "var(--food-red)") : "#999" }}>
            <Icon />
          </button>
        ))}
      </nav>
    </div>
  );
}
