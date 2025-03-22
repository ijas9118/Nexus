import LoginPage from "@/pages/auth/Login";
import Home from "@/pages/normal/Home";
import Layout from "@/pages/normal/Layout";
import MyFeed from "@/features/content/MyFeed";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GetPremium from "@/pages/normal/GetPremium";
import Bookmark from "@/features/content/Bookmark";
import NotFound from "@/pages/NotFound";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Squads from "@/features/squad/Squads";
import Connections from "@/pages/normal/Connections";
import History from "@/features/content/History";
import ContentDetails from "@/features/content/ContentDetails";
import ProfilePage from "@/features/profile/Profile";
import EditProfile from "@/features/profile/EditProfileLayout";
import Chat from "@/features/chat/Chat";
import Following from "@/features/content/Following";
import Mentors from "@/pages/normal/mentors/Mentors";
import MentorApply from "@/pages/normal/mentors/MentorApply";
import MentorProfilePage from "@/pages/normal/mentors/MentorProfilePage";
import BookSession from "@/pages/normal/mentors/BookSession";
import { MentorFormProvider } from "@/context/MentorFormContext";
import AddPost from "@/features/addPost/AddPost";

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
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MentorFormProvider>
  );
};

export default UserRoutes;
