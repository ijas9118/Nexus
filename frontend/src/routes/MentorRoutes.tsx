import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Skeleton } from "@/components/atoms/skeleton";
import MentorDashboard from "@/features/mentor-dashboard/MentorDashboard";

// Lazy load page components
const Layout = lazy(() => import("@/pages/Layout"));
const MentorSettings = lazy(
  () => import("@/features/mentor-settings/MentorSettings"),
);
const ScheduleCallsManagement = lazy(
  () => import("@/features/mentorshipBookings/BookingsPage"),
);
const MentorAvailabilityPage = lazy(
  () => import("@/features/mentor-timeslots/ManageTimeslots"),
);
const WalletPage = lazy(() => import("@/features/wallet/WalletPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

const MentorRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route element={<ProtectedRoute requiredRoles={["mentor"]} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<MentorDashboard />} />

            <Route path="/time-slots" element={<MentorAvailabilityPage />} />
            <Route
              path="/scheduled-calls"
              element={<ScheduleCallsManagement />}
            />
            <Route path="/settings" element={<MentorSettings />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default MentorRoutes;
