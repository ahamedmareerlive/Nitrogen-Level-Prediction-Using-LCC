import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Home from "./home";
import History from "./history";
import AdminPanel from "./AdminPanel";
import ProtectedRoute from "./protectRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="*" element={<div>404: Page Not Found</div>} />
    </Routes>
  );
}

export default App;
