import type {
  PendingWithdrawalsResponse,
  SessionStatsResponse,
} from "@/core/types/mentor-dashboard";

export interface IMentorDashboardRepository {
  getEarnings: (userId: string) => Promise<{ thisMonth: number; lastMonth: number }>;
  getPendingWithdrawalWithBalance: (userId: string) => Promise<PendingWithdrawalsResponse>;
  getSessionStats: (userId: string) => Promise<SessionStatsResponse>;
  getRecentTransactions: (userId: string) => Promise<any>;
  getMentorshipTypeStats: (userId: string) => Promise<any>;
}
