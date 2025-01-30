import LoginPage from "@/pages/auth/Login";
import AddPost from "@/pages/normal/AddPost";
import Home from "@/pages/normal/Home";
import Layout from "@/pages/normal/Layout";
import MyFeed from "@/pages/normal/MyFeed";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "@/pages/normal/Profile";
import GetPremium from "@/pages/normal/GetPremium";
import Bookmark from "@/pages/normal/Bookmark";
import NotFound from "@/pages/NotFound";

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
          <Route path="profile" element={<UserProfile />} />
          <Route path="addPost" element={<AddPost />} />
          <Route path="bookmark" element={<Bookmark />} />
          <Route path="getPremium" element={<GetPremium />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
