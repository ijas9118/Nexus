import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AdminLayout = lazy(() => import("@/pages/AdminLayout"));
const Login = lazy(() => import("@/features/admin/Login"));
const Dashboard = lazy(() => import("@/features/admin/Dashboard"));
const UserManagement = lazy(() => import("@/features/admin/UserManagement"));
const CategoryManagement = lazy(
  () => import("@/features/admin/CategoryManagement"),
);
const SquadManagement = lazy(() => import("@/features/admin/SquadManagement"));
const MentorManagement = lazy(
  () => import("@/features/admin/MentorManagement"),
);
const CommentManagement = lazy(
  () => import("@/features/admin/CommentManagement"),
);
const ContentManagement = lazy(
  () => import("@/features/admin/ContentManagement"),
);
const ContentDetail = lazy(
  () => import("@/features/admin/content-management/components/ContentDetail"),
);
const SubscriptionPlan = lazy(
  () => import("@/features/admin/SubscriptionPlan"),
);
const MentorshipTypeSettings = lazy(
  () => import("@/features/admin/MentorshipTypeSettings"),
);
const MentorMetadataPage = lazy(
  () => import("@/features/admin/MentorMetadata"),
);
const TargetAudiencesPage = lazy(
  () => import("@/features/admin/TargetAudienceManagement"),
);
const NotificationTypesPage = lazy(
  () => import("@/features/admin/NotificationTypesPage"),
);
const WithdrawalRequestsPage = lazy(
  () => import("@/features/admin/WithdrawalManagement"),
);
const ForbiddenPage = lazy(() => import("@/pages/Unauthorized"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
            <Route path="plans" element={<SubscriptionPlan />} />
            <Route
              path="mentorship-type"
              element={<MentorshipTypeSettings />}
            />
            <Route path="mentor-meta-data" element={<MentorMetadataPage />} />
            <Route path="target-audience" element={<TargetAudiencesPage />} />
            <Route
              path="notification-type"
              element={<NotificationTypesPage />}
            />
            <Route path="withdrawal" element={<WithdrawalRequestsPage />} />
            <Route path="unauthorized" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
