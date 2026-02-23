import { handleApi } from "@/utils/handleApi";
import api from "./api";
import {
  EarningsResponse,
  PendingWithdrawalsResponse,
  RecentBooking,
  SessionStatsResponse,
} from "@/types/mentorDashboard.types";
import { ADMIN_ROUTES } from "@/utils/constants";

const MentorDashboardService = {
  getEarnings: () =>
    handleApi(() =>
      api.get<EarningsResponse>(`${ADMIN_ROUTES.DASHBOARD}/earnings`),
    ),

  getPendingWithdrawals: () =>
    handleApi(() =>
      api.get<PendingWithdrawalsResponse>(
        `${ADMIN_ROUTES.DASHBOARD}/pending-withdrawals`,
      ),
    ),

  getSessionStats: () =>
    handleApi(() =>
      api.get<SessionStatsResponse>(`${ADMIN_ROUTES.DASHBOARD}/session-stats`),
    ),

  getRecentBookings: () =>
    handleApi(() =>
      api.get<RecentBooking[]>(`${ADMIN_ROUTES.DASHBOARD}/recent-bookings`),
    ),

  getRecentTransactions: () =>
    handleApi(() => api.get(`${ADMIN_ROUTES.DASHBOARD}/recent-transactions`)),

  getMentorshipTypes: () =>
    handleApi(() => api.get(`${ADMIN_ROUTES.DASHBOARD}/mentorship-types`)),
};

export default MentorDashboardService;
