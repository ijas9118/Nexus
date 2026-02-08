import type { AdminDashboardStatsDTO } from '@/dtos/responses/admin/admin-dashboard-stats.dto';
import type { MentorApplicationStatsDTO } from '@/dtos/responses/admin/mentor-application-stats-dto';
import type { RevenueStatsDTO } from '@/dtos/responses/admin/revenue-stats-dto';
import type { SubscriptionStatsDTO } from '@/dtos/responses/admin/subscription-stats-dto';

export interface IAdminDashboardService {
  getStats: () => Promise<AdminDashboardStatsDTO>;
  getSubscriptionStats: () => Promise<SubscriptionStatsDTO>;
  getRevenueStats: (timeRange: string) => Promise<RevenueStatsDTO>;
  getMentorApplicationStats: () => Promise<MentorApplicationStatsDTO>;
}
