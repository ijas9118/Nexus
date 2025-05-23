import { AdminDashboardStatsDTO } from '@/dtos/responses/admin/AdminDashboardStats.dto';
import { SubscriptionStatsDTO } from '@/dtos/responses/admin/SubscriptionStatsDTO';

export interface IAdminDashboardService {
  getStats(): Promise<AdminDashboardStatsDTO>;
  getSubscriptionStats(): Promise<SubscriptionStatsDTO>;
}
