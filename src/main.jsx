import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ import router
import App from "./app/App";
import "./styles/index.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter> {/* ✅ wrap App in BrowserRouter */}
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
