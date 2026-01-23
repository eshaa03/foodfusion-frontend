import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/admin/Login.jsx";
import { UserApp } from "./UserApp.jsx";
import { AdminApp } from "./AdminApp.jsx";
// agent
import AgentLayout from "./components/agent/AgentLayout";
import AgentDashboard from "./components/agent/AgentDashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check for existing session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
    setAuthToken(token);
  };

  // ✅ LOGOUT (THIS IS ENOUGH)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setAuthToken(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E23744] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate
              to={
                currentUser.role === "user"
                  ? "/"
                  : currentUser.role === "agent"
                    ? "/agent/dashboard"
                    : "/admin"
              }
              replace
            />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* USER ROUTES */}
      <Route
        path="/*"
        element={
          currentUser?.role === "user" ? (
            <UserApp
              user={currentUser}
              token={authToken}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/*"
        element={
          currentUser?.role === "admin" ||
            currentUser?.role === "superadmin" ? (
            <AdminApp user={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ✅ Agent routes */}
      <Route
        path="/agent/*"
        element={
          currentUser?.role === "agent" ? (
            <AgentLayout user={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<AgentDashboard />} />
      </Route>
    </Routes>
  );
}
