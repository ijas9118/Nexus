import LoginPage from "@/pages/auth/Login";
import AddPost from "@/pages/normal/AddPost";
import Home from "@/pages/normal/Home";
import Layout from "@/pages/normal/Layout";
import MyFeed from "@/pages/normal/MyFeed";
import Profile from "@/pages/normal/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
            <LoginPage />
          </GoogleOAuthProvider>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="myFeed" element={<MyFeed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addPost" element={<AddPost />} />
        </Route>
      </Route>
      {/* <Route path="/not-found" element={<NotFound />} /> */}
    </Routes>
  );
};

export default UserRoutes;
