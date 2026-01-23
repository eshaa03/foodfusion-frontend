import { useEffect, useState } from "react";
import { Star, Clock, MapPin, Award, Pencil } from "lucide-react";

export default function AdminProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch("https://foodfusion-backend-zjrp.onrender.com/api/admin/restaurant", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurant(data);
        setForm(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveRestaurant = async () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== undefined && form[key] !== null) {
        data.append(key, form[key]);
      }
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    const res = await fetch("https://foodfusion-backend-zjrp.onrender.com/api/admin/restaurant", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
    });

    const updated = await res.json();

    setRestaurant(updated);     // ✅ PROFILE
    setForm(updated);
    setEditMode(false);
    setImageFile(null);

    // ✅ FORCE TOPBAR UPDATE
    window.dispatchEvent(
      new CustomEvent("restaurantUpdated", { detail: updated })
    );
  };


  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading restaurant profile...
      </div>
    );
  }

  if (!restaurant || restaurant.message) {
    return (
      <div className="text-center py-10 text-gray-500">
        No restaurant linked to this admin.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={
            imageFile
              ? URL.createObjectURL(imageFile)
              : restaurant.image
                ? `https://foodfusion-backend-zjrp.onrender.com${restaurant.image}`
                : "https://via.placeholder.com/800x300"
          }
          alt={restaurant.name}
          className="w-full h-60 object-cover"
        />

        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="absolute bottom-4 left-4 bg-white text-sm"
          />
        )}

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow"
          >
            <Pencil size={18} />
          </button>
        )}

        {restaurant.isFeatured && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#E23744] text-white px-4 py-1 rounded-full text-sm font-bold">
            <Award className="w-4 h-4" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {editMode ? (
          <>
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Restaurant name"
            />

            {/* Cuisine Selector */}
            <select
              value={form.cuisine || ""}
              onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Select Cuisine</option>
              {["American", "Italian", "Japanese", "Mexican", "Asian", "Indian", "Healthy", "Dessert", "Fast Food"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={form.dietaryType || "Normal"}
              onChange={(e) => setForm({ ...form, dietaryType: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="Normal">Normal (Standard)</option>
              <option value="Healthy">Healthy Only</option>
              <option value="Both">Both (Healthy & Normal)</option>
            </select>

            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 rounded"
              placeholder="Description"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.deliveryTime || ""}
                onChange={(e) =>
                  setForm({ ...form, deliveryTime: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Delivery time"
              />
              <input
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border p-2 rounded"
                placeholder="Restaurant address"
              />

            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${restaurant.dietaryType === 'Healthy' ? 'bg-green-100 text-green-700' :
                restaurant.dietaryType === 'Both' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                {restaurant.dietaryType || 'Normal'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{restaurant.description}</p>
          </>
        )}

        {/* Stats */}
        {!editMode && (
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 pt-3">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{restaurant.rating}</span>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              {restaurant.deliveryTime}
            </div>

            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4" />
              {restaurant.address}
            </div>
          </div>
        )}

        {/* Actions */}
        {editMode && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveRestaurant}
              className="px-4 py-2 bg-[#E23744] text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setForm(restaurant);
                setImageFile(null);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
