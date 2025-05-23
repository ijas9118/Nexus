import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { MentorFormProvider } from "@/context/MentorFormContext";
import { Skeleton } from "@/components/atoms/skeleton";
import ConnectionsPage from "@/features/connections/ConnectionsPage";
import SquadDetailPage from "@/features/squad-detail/SquadDetailPage";
import VerifyContentPage from "@/features/squad-content-verify/VerifyContentPage";
import SquadAdminDashboard from "@/features/squad-admin-dashboard/SquadAdminDashboard";

const Home = lazy(() => import("@/pages/Home"));
const LoginPage = lazy(() => import("@/features/auth/Login"));
const ForgotPassword = lazy(() => import("@/features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/features/auth/ResetPassword"));
const Layout = lazy(() => import("@/pages/Layout"));
const MyFeed = lazy(() => import("@/features/content/MyFeed"));
const ProfilePage = lazy(() => import("@/features/profile/Profile"));
const EditProfileLayout = lazy(
  () => import("@/features/profile/EditProfileLayout"),
);
const AddPost = lazy(() => import("@/features/addPost/AddPost"));
const Bookmark = lazy(() => import("@/features/content/Bookmark"));
const GetPremium = lazy(() => import("@/features/getPremium/GetPremium"));
const PremiumDashboard = lazy(
  () => import("@/features/premium-dashboard/PremiumDashboard"),
);
const UpgradePlanPage = lazy(
  () => import("@/features/premium-dashboard/UpgradePlanPage"),
);
const Mentors = lazy(() => import("@/features/mentor/MentorsListPage"));
const MentorApply = lazy(() => import("@/features/mentor/MentorApply"));
const MentorProfilePage = lazy(
  () => import("@/features/mentor/MentorDetailPage"),
);
const BookingPage = lazy(() => import("@/features/mentor/BookingPage"));
const VideoCallPage = lazy(() => import("@/features/videoCall/VideoCallPage"));
const MentorshipMeetingsPage = lazy(
  () => import("@/features/mentorship-meetings/MentorshipMeetingsPage"),
);
const Squads = lazy(() => import("@/features/squad-list/Squads"));
const Chat = lazy(() => import("@/features/chat/Chat"));
const History = lazy(() => import("@/features/content/History"));
const ContentDetails = lazy(() => import("@/features/content/ContentDetails"));
const Following = lazy(() => import("@/features/content/Following"));
const NotificationsPage = lazy(
  () => import("@/features/notification/NotificationsPage"),
);
const PaymentPage = lazy(() => import("@/features/payment/PaymentPage"));
const BookingStatus = lazy(() => import("@/features/booking/BookingStatus"));
const ForbiddenPage = lazy(() => import("@/pages/Unauthorized"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const UserRoutes: React.FC = () => {
  return (
    <MentorFormProvider>
      <Suspense fallback={<Skeleton />}>
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
              <Route path="squads/:handle" element={<SquadDetailPage />} />
              <Route
                path="squads/:squadId/verify"
                element={<VerifyContentPage />}
              />
              <Route
                path="squads/dashboard"
                element={<SquadAdminDashboard />}
              />
              <Route path="chat" element={<Chat />} />
              <Route path="connections" element={<ConnectionsPage />} />
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
      </Suspense>
    </MentorFormProvider>
  );
};

export default UserRoutes;
