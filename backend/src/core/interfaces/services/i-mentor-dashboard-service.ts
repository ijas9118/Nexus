import type {
  EarningsResponse,
  PendingWithdrawalsResponse,
  RecentBooking,
  SessionStatsResponse,
} from '@/core/types/mentor-dashboard';

export interface IMentorDashboardService {
  getEarnings: (userId: string) => Promise<EarningsResponse>;
  getPendingWithdrawalWithBalance: (userId: string) => Promise<PendingWithdrawalsResponse>;
  getSessionStats: (userId: string) => Promise<SessionStatsResponse>;
  getRecentBookings: (userId: string) => Promise<RecentBooking[]>;
}
