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
import SubscriptionPlan from "@/features/admin/SubscriptionPlan";
import MentorshipTypeSettings from "@/features/admin/MentorshipTypeSettings";
import ForbiddenPage from "@/pages/Unauthorized";
import MentorMetadataPage from "@/features/admin/MentorMetadata";
import TargetAudiencesPage from "@/features/admin/TargetAudienceManagement";
import NotificationTypesPage from "@/features/admin/NotificationTypesPage";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="squads" element={<SquadManagement />} />
          <Route path="mentors" element={<MentorManagement />} />
          <Route path="comments" element={<CommentManagement />} />
          <Route path="contents" element={<ContentManagement />} />
          <Route path="contents/:contentId" element={<ContentDetail />} />
          <Route path="payment" element={<PaymentManagement />} />
          <Route path="plans" element={<SubscriptionPlan />} />
          <Route path="mentorship-type" element={<MentorshipTypeSettings />} />
          <Route path="mentor-meta-data" element={<MentorMetadataPage />} />
          <Route path="target-audience" element={<TargetAudiencesPage />} />
          <Route path="notification-type" element={<NotificationTypesPage />} />
          <Route path="unauthorized" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
