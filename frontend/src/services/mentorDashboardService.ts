import { handleApi } from "@/utils/handleApi";
import api from "./api";
import {
  EarningsResponse,
  PendingWithdrawalsResponse,
  RecentBooking,
  SessionStatsResponse,
} from "@/types/mentorDashboard.types";

const MentorDashboardService = {
  getEarnings: () =>
    handleApi(() => api.get<EarningsResponse>("/mentor/dashboard/earnings")),

  getPendingWithdrawals: () =>
    handleApi(() =>
      api.get<PendingWithdrawalsResponse>(
        "/mentor/dashboard/pending-withdrawals",
      ),
    ),

  getSessionStats: () =>
    handleApi(() =>
      api.get<SessionStatsResponse>("/mentor/dashboard/session-stats"),
    ),

  getRecentBookings: () =>
    handleApi(() =>
      api.get<RecentBooking[]>("/mentor/dashboard/recent-bookings"),
    ),

  getRecentTransactions: () =>
    handleApi(() => api.get("/mentor/dashboard/recent-transactions")),

  getMentorshipTypes: () =>
    handleApi(() => api.get("/mentor/dashboard/mentorship-types")),
};

export default MentorDashboardService;
