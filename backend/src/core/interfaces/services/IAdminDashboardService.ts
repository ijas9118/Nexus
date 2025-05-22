import { AdminDashboardStatsDTO } from '@/dtos/responses/admin/AdminDashboardStats.dto';

export interface IAdminDashboardService {
  getStats(): Promise<AdminDashboardStatsDTO>;
}
