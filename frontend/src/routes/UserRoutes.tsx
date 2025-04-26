import LoginPage from "@/features/auth/Login";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import MyFeed from "@/features/content/MyFeed";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GetPremium from "@/features/getPremium/GetPremium";
import Bookmark from "@/features/content/Bookmark";
import NotFound from "@/pages/NotFound";
import ForgotPassword from "@/features/auth/ForgotPassword";
import ResetPassword from "@/features/auth/ResetPassword";
import Squads from "@/features/squad/Squads";
import Connections from "@/features/profile/Connections";
import History from "@/features/content/History";
import ContentDetails from "@/features/content/ContentDetails";
import ProfilePage from "@/features/profile/Profile";
import EditProfile from "@/features/profile/EditProfileLayout";
import Following from "@/features/content/Following";
import Mentors from "@/features/mentor/MentorsListPage";
import MentorApply from "@/features/mentor/MentorApply";
import MentorProfilePage from "@/features/mentor/MentorDetailPage";
import BookSession from "@/features/mentor/BookSession";
import { MentorFormProvider } from "@/context/MentorFormContext";
import AddPost from "@/features/addPost/AddPost";
import Chat from "@/features/chat/Chat";
import NotificationsPage from "@/features/notification/NotificationsPage";
import PremiumDashboard from "@/features/premium-dashboard/PremiumDashboard";

const UserRoutes: React.FC = () => {
  return (
    <MentorFormProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
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
            <Route path="premium" element={<PremiumDashboard />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="mentors/apply" element={<MentorApply />} />
            <Route path="mentors/:mentorId" element={<MentorProfilePage />} />
            <Route path="mentors/:mentorId/book" element={<BookSession />} />
            <Route path="squads" element={<Squads />} />
            <Route path="chat" element={<Chat />} />
            <Route path="connections" element={<Connections />} />
            <Route path="history" element={<History />} />
            <Route path="content/:id" element={<ContentDetails />} />
            <Route path="following" element={<Following />} />
            <Route path="notification" element={<NotificationsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MentorFormProvider>
  );
};

export default UserRoutes;
