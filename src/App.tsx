import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TrackingSheet from "./pages/TrackingSheet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track/:routineId" element={<TrackingSheet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 