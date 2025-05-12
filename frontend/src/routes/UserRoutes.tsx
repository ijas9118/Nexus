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
import Following from "@/features/content/Following";
import Mentors from "@/features/mentor/MentorsListPage";
import MentorApply from "@/features/mentor/MentorApply";
import MentorProfilePage from "@/features/mentor/MentorDetailPage";
import { MentorFormProvider } from "@/context/MentorFormContext";
import AddPost from "@/features/addPost/AddPost";
import Chat from "@/features/chat/Chat";
import NotificationsPage from "@/features/notification/NotificationsPage";
import PremiumDashboard from "@/features/premium-dashboard/PremiumDashboard";
import PaymentPage from "@/features/payment/PaymentPage";
import EditProfileLayout from "@/features/profile/EditProfileLayout";
import UpgradePlanPage from "@/features/premium-dashboard/UpgradePlanPage";
import BookingPage from "@/features/mentor/BookingPage";
import ForbiddenPage from "@/pages/Unauthorized";
import BookingStatus from "@/features/booking/BookingStatus";
import VideoCallPage from "@/features/videoCall/VideoCallPage";
import MentorshipMeetingsPage from "@/features/mentorship-meetings/MentorshipMeetingsPage";

const UserRoutes: React.FC = () => {
  return (
    <MentorFormProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/forgot-password" element={<ForgotPassword />} />
        <Route path="/login/reset-password" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute requiredRoles={["user", "mentor", "premium"]} />
          }
        >
          <Route path="/" element={<Layout />}>
            <Route path="myFeed" element={<MyFeed />} />
            <Route path="profile/:username" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfileLayout />} />
            <Route path="addPost" element={<AddPost />} />
            <Route path="bookmark" element={<Bookmark />} />
            <Route element={<ProtectedRoute requiredRoles={["user"]} />}>
              <Route path="getPremium" element={<GetPremium />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={["premium"]} />}>
              <Route path="premium" element={<PremiumDashboard />} />
              <Route path="premium/upgrade" element={<UpgradePlanPage />} />
            </Route>
            <Route path="mentors" element={<Mentors />} />
            <Route path="mentors/apply" element={<MentorApply />} />
            <Route path="mentors/:mentorId" element={<MentorProfilePage />} />
            <Route path="mentors/:mentorId/book" element={<BookingPage />} />
            <Route path="meeting/:meetId/" element={<VideoCallPage />} />
            <Route
              path="mentorship-meetings"
              element={<MentorshipMeetingsPage />}
            />
            <Route path="squads" element={<Squads />} />
            <Route path="chat" element={<Chat />} />
            <Route path="connections" element={<Connections />} />
            <Route path="history" element={<History />} />
            <Route path="content/:id" element={<ContentDetails />} />
            <Route path="following" element={<Following />} />
            <Route path="notification" element={<NotificationsPage />} />
            <Route path="/unauthorized" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/booking" element={<BookingStatus />} />
      </Routes>
    </MentorFormProvider>
  );
};

export default UserRoutes;
