import { AdminDashboardStatsDTO } from '@/dtos/responses/admin/AdminDashboardStats.dto';
import { MentorApplicationStatsDTO } from '@/dtos/responses/admin/MentorApplicationStatsDTO';
import { RevenueStatsDTO } from '@/dtos/responses/admin/RevenueStatsDTO';
import { SubscriptionStatsDTO } from '@/dtos/responses/admin/SubscriptionStatsDTO';

export interface IAdminDashboardService {
  getStats(): Promise<AdminDashboardStatsDTO>;
  getSubscriptionStats(): Promise<SubscriptionStatsDTO>;
  getRevenueStats(timeRange: string): Promise<RevenueStatsDTO>;
  getMentorApplicationStats(): Promise<MentorApplicationStatsDTO>;
}
