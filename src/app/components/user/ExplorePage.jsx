import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Award,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorePage({ isDietMode }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tempAddress, setTempAddress] = useState(deliveryAddress);
  const [restaurants, setRestaurants] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    // 1. Fetch Restaurants
    fetch(`${import.meta.env.VITE_API_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => {
        console.log("Raw Restaurants Data:", data); // 🔥 DEBUG

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          return;
        }

        const normalized = data.map(r => ({
          ...r,
          id: r._id,
          image: r.image
            ? `${import.meta.env.VITE_API_URL}${r.image}`
            : "https://via.placeholder.com/400",
        }));
        console.log("Normalized Restaurants:", normalized); // 🔥 DEBUG
        setRestaurants(normalized);
      })
      .catch(err => console.error("Failed to load restaurants", err));

    // 2. Fetch User Profile for Address
   fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(user => {
        if (user.addresses && user.addresses.length > 0) {
          const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
          setDeliveryAddress(`${def.house}, ${def.street}, ${def.city}`);
          setTempAddress(`${def.house}, ${def.street}, ${def.city}`);
        } else {
          setDeliveryAddress("Add an address in Profile");
        }
      })
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  /* ---------------- FILTERING ---------------- */
  // 1. Filter by Diet Mode first
  const availableRestaurants = restaurants.filter(restaurant => {
    const type = restaurant.dietaryType || "Normal";
    if (isDietMode) {
      return type === "Healthy" || type === "Both";
    } else {
      return type === "Normal" || type === "Both";
    }
  });

  // 2. Derive Cuisines from available restaurants
  const availableCuisines = ["All", ...new Set(availableRestaurants.map(r => r.cuisine).filter(Boolean))];

  // 3. Apply Search and Cuisine Filters
  const filteredRestaurants = availableRestaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  const featuredRestaurants = filteredRestaurants.filter(r => r.isFeatured);

  const handleSaveAddress = () => {
    setDeliveryAddress(tempAddress);
    setShowLocationModal(false);
  };

  const handleRestaurantClick = restaurant => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className="pb-20 px-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Explore Restaurants</h1>
        <p className="text-sm text-gray-600">Discover amazing food near you</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl px-4 py-3 mb-5 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search restaurants or cuisines..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* Location */}
      <div
        className="bg-white rounded-xl px-4 py-3 mb-5 shadow-sm flex items-center gap-3 cursor-pointer"
        onClick={() => setShowLocationModal(true)}
      >
        <MapPin
          className="w-5 h-5"
          style={{ color: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
        />
        <div className="flex-1">
          <p className="text-xs text-gray-500">Delivering to</p>
          <p className="font-semibold text-gray-800">{deliveryAddress}</p>
        </div>
        <button
          className="text-xs font-semibold"
          style={{ color: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
        >
          Change
        </button>
      </div>

      {/* Cuisine Filter (Pills) */}
      <div className="flex gap-3 overflow-x-auto mb-5 pb-2">
        {availableCuisines.map(cuisine => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className="px-4 py-2 rounded-full text-xs font-semibold text-white flex-shrink-0"
            style={{
              backgroundColor:
                selectedCuisine === cuisine
                  ? isDietMode
                    ? "var(--food-green)"
                    : "var(--food-red)"
                  : "var(--food-yellow)",
            }}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featuredRestaurants.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp
              className="w-5 h-5"
              style={{ color: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
            />
            <h2 className="text-lg font-bold">Featured</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredRestaurants.map((restaurant, i) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleRestaurantClick(restaurant)}
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
              >
                <img src={restaurant.image} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold">{restaurant.rating?.toFixed(1) || "New"}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Restaurants */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award
            className="w-5 h-5"
            style={{ color: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
          />
          <h2 className="text-lg font-bold">All Restaurants</h2>
        </div>

        <div className="flex flex-wrap -mx-2">
          {filteredRestaurants.map((restaurant, i) => (
            <div key={restaurant.id} className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleRestaurantClick(restaurant)}
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
              >
                <img src={restaurant.image} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm truncate pr-2">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-bold">{restaurant.rating?.toFixed(1) || "New"}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No restaurants found
          </div>
        )}
      </div>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <h3 className="font-bold mb-3">Change Address</h3>
              <input
                value={tempAddress}
                onChange={e => setTempAddress(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
              <button
                onClick={handleSaveAddress}
                className="w-full mt-4 py-3 text-white rounded-xl font-bold"
                style={{ backgroundColor: isDietMode ? "var(--food-green)" : "var(--food-red)" }}
              >
                Save Address
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
