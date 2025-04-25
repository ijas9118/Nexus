import AdminLayout from "@/pages/AdminLayout";
import CategoryManagement from "@/features/admin/CategoryManagement";
import Dashboard from "@/features/admin/Dashboard";
import Login from "@/features/admin/Login";
import MentorManagement from "@/features/admin/MentorManagement";
import SquadManagement from "@/features/admin/SquadManagement";
import UserManagement from "@/features/admin/UserManagement";

import NotFound from "@/pages/NotFound";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CommentManagement from "@/features/admin/CommentManagement";
import ContentDetail from "@/features/admin/content-management/components/ContentDetail";
import PaymentManagement from "@/features/admin/PaymentManagement";
import ContentManagement from "@/features/admin/ContentManagement";
import PricingCard from "@/features/admin/SubscriptionPlan";

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
          <Route path="comments" element={<CommentManagement />} />
          <Route path="contents" element={<ContentManagement />} />
          <Route path="contents/:contentId" element={<ContentDetail />} />
          <Route path="payment" element={<PaymentManagement />} />
          <Route path="plan" element={<PricingCard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
