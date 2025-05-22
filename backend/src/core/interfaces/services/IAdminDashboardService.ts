import { AdminDashboardStatsDTO } from '@/dtos/responses/auth.dto';

export interface IAdminDashboardService {
  getStats(): Promise<AdminDashboardStatsDTO>;
}
