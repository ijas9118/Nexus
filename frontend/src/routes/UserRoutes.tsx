import LoginPage from "@/pages/auth/Login";
import Home from "@/pages/normal/Home";
import Layout from "@/pages/normal/Layout";
import MyFeed from "@/pages/normal/MyFeed";
import React from "react";
import { Route, Routes } from "react-router-dom";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />{" "}
      <Route path="/myFeed" element={<Layout children={<MyFeed />} />} />
      {/* <Route path="/not-found" element={<NotFound />} /> */}
    </Routes>
  );
};

export default UserRoutes;
