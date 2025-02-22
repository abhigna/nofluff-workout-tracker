import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TrackingSheet from "./pages/TrackingSheet";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track/:routineId" element={<TrackingSheet />} />
      </Routes>
    </HashRouter>
  );
}

export default App; 