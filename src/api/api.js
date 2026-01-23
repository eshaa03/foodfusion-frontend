import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// AUTH
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const logout = () => API.post("/auth/logout");
export const getProfile = () => API.get("/auth/profile");
export const getUsers = () => API.get("/users"); // ✅ NEW
export const deleteUser = (id) => API.delete(`/users/${id}`);

// FOOD (ADMIN)
export const getAdminFoods = () => API.get("/foods/admin");

// FOOD (PUBLIC / USER)
export const getFoods = () => API.get("/foods");
export const addFood = (data) =>
  API.post("/foods", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateFood = (id, data) =>
  API.put(`/foods/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteFood = (id) => API.delete(`/foods/${id}`);

// CART
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart/add", data);

// ORDERS (USER)
export const placeOrder = (data) => API.post("/orders");

// ORDERS (ADMIN) ✅ REQUIRED
export const getAdminOrders = () => API.get("/orders/admin");

// ORDER STATUS UPDATE (ADMIN) ✅ REQUIRED
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

// RESTAURANT (ADMIN)
export const getMyRestaurant = () => API.get("/admin/restaurant");

export const updateMyRestaurant = (data) =>
  API.put("/admin/restaurant", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// AGENT STATUS
export const toggleAgentStatus = () => API.put("/agent/toggle-status");
export const getAgentStatus = () => API.get("/agent/status");

export const getSuperAdminOrders = () =>
  API.get("/orders/superadmin");

export const getDashboardStats = () => API.get("/orders/stats"); // ✅ NEW

export const getPendingApprovals = () => API.get("/auth/pending"); // ✅ NEW
export const approveUser = (userId) => API.post("/auth/approve", { userId }); // ✅ NEW
export const getApprovedUsers = () => API.get("/auth/approved"); // ✅ NEW

export const getSystemSettings = () => API.get("/admin/settings"); // ✅ NEW
export const updateSystemSettings = (data) => API.put("/admin/settings", data); // ✅ NEW

export default API;
