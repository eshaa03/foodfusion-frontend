import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getAdminFoods, addFood, deleteFood, updateFood } from "../../../api/api";


function FoodManagement() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "", // ✅ Fix: Initialize to empty string
    category: "",
    basePrice: "",

    // 🔥 NEW
    mode: "both",        // diet | normal | both
    isAvailable: true,   // available / unavailable

    portions: [
      { id: "small", label: "Small", multiplier: 0.8 },
      { id: "regular", label: "Regular", multiplier: 1.0 },
      { id: "large", label: "Large", multiplier: 1.3 },
    ],

    ingredients: [],
  });


  /* ---------------- LOAD FOODS ---------------- */
  useEffect(() => {
    getAdminFoods().then((res) => {
      setFoods(res.data.map(f => ({ ...f, id: f._id })));
    });
  }, []);

  /* ---------------- EDIT EFFECT ---------------- */
  useEffect(() => {
    if (editingFood) {
      setFormData({
        name: editingFood.name || "",
        category: editingFood.category || "",
        basePrice: editingFood.basePrice || "",
        imageUrl: editingFood.image || "",
        mode: editingFood.mode || "both",
        isAvailable: editingFood.isAvailable !== undefined ? editingFood.isAvailable : true,
        portions: editingFood.portions?.length
          ? editingFood.portions
          : [
            { id: "small", label: "Small", multiplier: 0.8 },
            { id: "regular", label: "Regular", multiplier: 1.0 },
            { id: "large", label: "Large", multiplier: 1.3 },
          ],
        ingredients: editingFood.ingredients || [],
        imageFile: null,
      });
      setShowAddModal(true);
    }
  }, [editingFood]);

  /* ---------------- FILTER ---------------- */
  const filteredFoods = foods.filter((food) => {
    const name = food.name?.toLowerCase() || "";
    const category = food.category?.toLowerCase() || "";

    return (
      name.includes(searchQuery.toLowerCase()) ||
      category.includes(searchQuery.toLowerCase())
    );
  });


  /* ---------------- FORM HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("basePrice", Number(formData.basePrice));
      data.append("mode", formData.mode);
      data.append("isAvailable", formData.isAvailable);
      data.append("portions", JSON.stringify(formData.portions));
      data.append("ingredients", JSON.stringify(formData.ingredients));

      if (formData.imageFile) {
        data.append("image", formData.imageFile); // upload
      } else {
        data.append("imageUrl", formData.imageUrl); // url
      }

      const res = editingFood
        ? await updateFood(editingFood._id, data)
        : await addFood(data);

      if (editingFood) {
        setFoods(foods.map((f) => (f._id === editingFood._id ? res.data : f)));
      } else {
        setFoods([...foods, res.data]);
      }

      setShowAddModal(false);
      setEditingFood(null); // ✅ RESET

      setFormData({
        name: "",
        category: "",
        basePrice: "",
        imageUrl: "",
        imageFile: null,
        portions: [
          { id: "small", label: "Small", multiplier: 0.8 },
          { id: "regular", label: "Regular", multiplier: 1.0 },
          { id: "large", label: "Large", multiplier: 1.3 },
        ],
        ingredients: [],
      });
    } catch (err) {
      console.error(err);
    }
  };



  const handleDelete = async (id) => {
    if (!id) return; // ✅ prevent undefined API call
    if (!window.confirm("Delete this item?")) return;

    await deleteFood(id);
    setFoods(foods.filter((f) => f._id !== id && f.id !== id));
  };

  const handleAvailabilityToggle = async (food) => {
    try {
      const newStatus = !food.isAvailable;
      const data = new FormData();
      data.append("isAvailable", newStatus);


      const res = await updateFood(food._id, data);

      // Update local state
      setFoods(foods.map(f => f._id === food._id ? { ...f, isAvailable: newStatus } : f));
    } catch (err) {
      console.error("Failed to toggle availability", err);
      alert("Failed to update status");
    }
  };

  /* ---------------- HELPER ---------------- */
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `https://foodfusion-backend-zjrp.onrender.com${path}`;
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
            Food Items
          </h2>
          <p className="text-gray-600 text-[14px]">
            Manage your menu items and inventory
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E23744] text-white rounded-lg hover:bg-[#c42e3a]"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food items..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#E23744]"
          />
        </div>
      </div>
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => (
          <motion.div
            key={food._id || food.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm"
          >
            {/* ✅ IMAGE FIX */}
            <div className="relative">
              <img
                src={getImageUrl(food.image)}
                alt={food.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />
              {/* AVAILABILITY TOGGLE OVERLAY */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAvailabilityToggle(food);
                }}
                className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-colors ${food.isAvailable
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-black/70 text-white hover:bg-black/90"
                  }`}
              >
                {food.isAvailable ? "Available" : "Unavailable"}
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-[700]">{food.name}</h3>
                  <p className="text-[12px] text-gray-500">
                    {food.category}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {food.rating ? food.rating.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({food.reviews || 0})
                    </span>
                  </div>
                </div>

                {/* ✅ RUPEES FIX */}
                <span className="font-[700] text-[#E23744]">
                  ₹{food.basePrice}
                </span>
              </div>

              {food.restaurant?.name && (
                <p className="text-xs text-gray-400 mt-1">
                  Restaurant: {food.restaurant.name}
                </p>
              )}


              {/* ✅ INGREDIENT FIX */}
              <p className="text-[12px] text-gray-500 mb-2">
                <span className="font-semibold">Ingredients:</span>{" "}
                {Array.isArray(food.ingredients) && food.ingredients.length > 0
                  ? food.ingredients.map((i) => i.name).join(", ")
                  : "None"}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingFood(food)}
                  className="flex-1 border rounded-lg py-2 flex justify-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>

                <button onClick={() => handleDelete(food._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {/* MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            key="add-food-modal"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >

              {/* HEADER */}
              <div className="p-5 border-b shrink-0 bg-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingFood ? "Edit Food Item" : "Add New Item"}
                </h3>
              </div>

              {/* SCROLLABLE BODY */}
              <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-300">

                {/* FOOD NAME */}
                <label className="text-sm font-semibold mb-1 block">Food Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Pizza"
                  className="w-full border p-3 rounded-lg mb-4"
                />


                <label className="text-sm font-semibold mb-1 block">Food Image</label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl || ""} // ✅ Fix: Ensure never null/undefined
                  onChange={handleChange}
                  placeholder="Image URL (optional)"
                  className="w-full border p-3 rounded-lg mb-2"
                />

                <div className="text-xs text-gray-500 mb-2 text-center">OR</div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, imageFile: e.target.files[0] })
                  }
                  className="w-full mb-4"
                />


                {(formData.imageFile || formData.imageUrl) && (
                  <img
                    src={
                      formData.imageFile
                        ? URL.createObjectURL(formData.imageFile)
                        : getImageUrl(formData.imageUrl)
                    }
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}


                {/* CATEGORY */}
                <label className="text-sm font-semibold mb-1 block">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg mb-4"
                >
                  <option value="">Select category</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Asian">Asian</option>
                </select>

                {/* MODE SELECTION */}
                <label className="text-sm font-semibold mb-1 block">Visible In</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg mb-4"
                >
                  <option value="both">Both (Diet & Normal)</option>
                  <option value="diet">Diet Mode Only</option>
                  <option value="normal">Normal Mode Only</option>
                </select>

                <label className="text-sm font-semibold mb-2 block">
                  Availability
                </label>

                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isAvailable: !formData.isAvailable })
                    }
                    className={`px-4 py-2 rounded-lg font-semibold ${formData.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {formData.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </div>

                <label className="text-sm font-semibold mb-1 block">
                  Base Price <span className="text-gray-500">(₹)</span>
                </label>

                <div className="flex items-center border rounded-lg mb-4">
                  <span className="px-3 text-gray-600">₹</span>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full p-3 outline-none"
                  />
                </div>

                <label className="text-sm font-semibold mb-2 block">
                  Portion Sizes (Price Multiplier)
                </label>

                <div className="space-y-3 mb-6">
                  {formData.portions.map((p, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        placeholder="Label (e.g. Small)"
                        value={p.label || ""}
                        onChange={(e) => {
                          const updated = [...formData.portions];
                          updated[index].label = e.target.value;
                          updated[index].id = e.target.value.toLowerCase().replace(/\s+/g, '-');
                          setFormData({ ...formData, portions: updated });
                        }}
                        className="flex-1 border p-2 rounded-lg text-sm"
                      />
                      <div className="flex items-center border rounded-lg w-[100px]">
                        <span className="px-2 text-gray-500 text-xs">x</span>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="1.0"
                          value={p.multiplier !== undefined && p.multiplier !== null ? p.multiplier : ""}
                          onChange={(e) => {
                            const updated = [...formData.portions];
                            updated[index].multiplier = e.target.value;
                            setFormData({ ...formData, portions: updated });
                          }}
                          className="w-full p-2 outline-none text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.portions.filter((_, i) => i !== index);
                          setFormData({ ...formData, portions: updated });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        portions: [...formData.portions, { id: "", label: "", multiplier: 1.0 }],
                      })
                    }
                    className="text-sm text-[#E23744] font-semibold"
                  >
                    + Add Portion Size
                  </button>
                </div>

                <label className="text-sm font-semibold mb-2 block">
                  Add-on Ingredients (₹)
                </label>

                {formData.ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      placeholder="Ingredient name"
                      value={ing.name || ""}
                      onChange={(e) => {
                        const updated = [...formData.ingredients];
                        updated[index].name = e.target.value;
                        setFormData({ ...formData, ingredients: updated });
                      }}
                      className="flex-1 border p-2 rounded-lg"
                    />

                    <div className="flex items-center border rounded-lg w-[120px]">
                      <span className="px-2 text-gray-600">₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={ing.price !== undefined && ing.price !== null ? ing.price : ""}
                        onChange={(e) => {
                          const updated = [...formData.ingredients];
                          updated[index].price = e.target.value;
                          setFormData({ ...formData, ingredients: updated });
                        }}
                        className="w-full p-2 outline-none"
                      />
                    </div>
                  </div>
                ))}


                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      ingredients: [...formData.ingredients, { name: "", price: "" }],
                    })
                  }
                  className="text-sm text-[#E23744] font-semibold mb-4"
                >
                  + Add Ingredient
                </button>

              </div>

              {/* FOOTER */}
              <div className="p-5 border-t bg-gray-50 flex gap-3 shrink-0">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFood(null); // ✅ RESET
                  }}
                  className="flex-1 border bg-white rounded-xl py-2.5 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#E23744] text-white rounded-xl py-2.5 font-semibold hover:bg-[#c42e3a] transition-colors"
                >
                  {editingFood ? "Update Food" : "Add Food"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FoodManagement;
