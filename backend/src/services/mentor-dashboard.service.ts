import { IBookingRepository } from '@/core/interfaces/repositories/IBookingRepository';
import { IMentorDashboardRepository } from '@/core/interfaces/repositories/IMentorDashboardRepository';
import { IMentorDashboardService } from '@/core/interfaces/services/IMentorDashboardService';
import {
  EarningsResponse,
  PendingWithdrawalsResponse,
  RecentBooking,
  SessionStatsResponse,
} from '@/core/types/mentorDashboard';
import { TYPES } from '@/di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class MentorDashboardService implements IMentorDashboardService {
  constructor(
    @inject(TYPES.MentorDashboardRepository) private repository: IMentorDashboardRepository,
    @inject(TYPES.BookingRepository) private bookingRepo: IBookingRepository
  ) {}

  async getEarnings(userId: string): Promise<EarningsResponse> {
    const { thisMonth, lastMonth } = await this.repository.getEarnings(userId);

    let percentageChange = 0;
    let changeDirection: 'increase' | 'decrease' | 'noChange' = 'noChange';

    if (lastMonth > 0) {
      percentageChange = ((thisMonth - lastMonth) / lastMonth) * 100;
      changeDirection =
        thisMonth > lastMonth ? 'increase' : thisMonth < lastMonth ? 'decrease' : 'noChange';
    } else if (thisMonth > 0) {
      percentageChange = 100;
      changeDirection = 'increase';
    }

    return {
      totalEarnings: thisMonth,
      percentageChange: Math.round(percentageChange),
      changeDirection,
    };
  }

  async getPendingWithdrawalWithBalance(userId: string): Promise<PendingWithdrawalsResponse> {
    const withdrawals = await this.repository.getPendingWithdrawalWithBalance(userId);
    return {
      pendingWithdrawal: withdrawals.pendingWithdrawal,
      balance: withdrawals.balance,
    };
  }

  async getSessionStats(userId: string): Promise<SessionStatsResponse> {
    return this.repository.getSessionStats(userId);
  }

  async getRecentBookings(userId: string): Promise<RecentBooking[]> {
    return this.bookingRepo.getRecentBookings(userId);
  }
}
