import LoginPage from "@/pages/auth/Login";
import AddPost from "@/pages/normal/AddPost";
import Home from "@/pages/normal/Home";
import Layout from "@/pages/normal/Layout";
import MyFeed from "@/pages/normal/MyFeed";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GetPremium from "@/pages/normal/GetPremium";
import Bookmark from "@/pages/normal/Bookmark";
import NotFound from "@/pages/NotFound";
import Experts from "@/pages/normal/Experts";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Squads from "@/pages/normal/Squads";
import Messages from "@/pages/normal/Messages";
import Connections from "@/pages/normal/Connections";
import History from "@/pages/normal/History";
import ContentDetails from "@/pages/normal/ContentDetails";
import ProfilePage from "@/pages/normal/Profile";
import EditProfile from "@/pages/normal/EditProfileLayout"; 

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
      <Route path="/login/forgot-password" element={<ForgotPassword />} />
      <Route path="/login/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="myFeed" element={<MyFeed />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="addPost" element={<AddPost />} />
          <Route path="bookmark" element={<Bookmark />} />
          <Route path="getPremium" element={<GetPremium />} />
          <Route path="experts" element={<Experts />} />
          <Route path="squads" element={<Squads />} />
          <Route path="chat" element={<Messages />} />
          <Route path="connections" element={<Connections />} />
          <Route path="history" element={<History />} />
          <Route path="content/:id" element={<ContentDetails />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
