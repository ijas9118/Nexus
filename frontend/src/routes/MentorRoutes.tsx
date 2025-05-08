import MentorSettings from "@/features/mentor-settings/MentorSettings";
import MentorPayments from "@/features/mentorPayment/MentorPayments";
import ScheduleCallsManagement from "@/features/mentorshipBooking/BookingsPage";
import Layout from "@/pages/Layout";
import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "@/pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import MentorAvailabilityPage from "@/features/mentor-timeslots/ManageTimeslots";

const MentorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={["mentor"]} />}>
        <Route element={<Layout />}>
          <Route path="/time-slots" element={<MentorAvailabilityPage />} />
          <Route
            path="/scheduled-calls"
            element={<ScheduleCallsManagement />}
          />
          <Route path="/payments" element={<MentorPayments />} />
          <Route path="/settings" element={<MentorSettings />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default MentorRoutes;
