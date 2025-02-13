import AdminLayout from "@/pages/admin/AdminLayout";
import CategoryManagement from "@/pages/admin/categoryManagement/CategoryManagement";
import Dashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/admin/Login";
import MentorManagement from "@/pages/admin/mentorManagement/MentorManagement";
import SquadManagement from "@/pages/admin/squadManagement/SquadManagement";
import UserManagement from "@/pages/admin/userManagement/UserManagement";

import NotFound from "@/pages/NotFound";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="squads" element={<SquadManagement />} />
          <Route path="mentors" element={<MentorManagement />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
