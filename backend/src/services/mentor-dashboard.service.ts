import { inject, injectable } from 'inversify';

import type { IBookingRepository } from '@/core/interfaces/repositories/i-booking-repository';
import type { IMentorDashboardRepository } from '@/core/interfaces/repositories/i-mentor-dashboard-repository';
import type { IMentorDashboardService } from '@/core/interfaces/services/i-mentor-dashboard-service';
import type {
  EarningsResponse,
  PendingWithdrawalsResponse,
  RecentBooking,
  SessionStatsResponse,
} from '@/core/types/mentor-dashboard';

import { TYPES } from '@/di/types';

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
