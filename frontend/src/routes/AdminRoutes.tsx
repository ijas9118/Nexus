import Dashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/admin/Login";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
