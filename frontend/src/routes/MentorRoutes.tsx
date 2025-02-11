import MentorInvitation from "@/pages/mentor/MentorInvitation";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MentorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/accept-invitation" element={<MentorInvitation />} />
    </Routes>
  );
};

export default MentorRoutes;
