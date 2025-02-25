import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}

// Create a root.
const root = createRoot(container);

// Initial render.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 