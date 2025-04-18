import MenteeRequests from "@/features/menteeRequests/MenteeRequests";
import MentorDashboard from "@/features/mentorDashboard/MentorDashboard";
import MentorPayments from "@/features/mentorPayment/MentorPayments";
import ScheduleCallsManagement from "@/features/mentorshipSchedule/ScheduleCallsManagement";
import TimeSlotManagement from "@/features/mentorTimeslots/TimeSlotManagement";
import Layout from "@/pages/Layout";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MentorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MentorDashboard />} />
        <Route path="/requests" element={<MenteeRequests />} />
        <Route path="/time-slots" element={<TimeSlotManagement />} />
        <Route path="/scheduled-calls" element={<ScheduleCallsManagement />} />
        <Route path="/payments" element={<MentorPayments />} />
      </Route>
    </Routes>
  );
};

export default MentorRoutes;
