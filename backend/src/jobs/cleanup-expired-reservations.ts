// jobs/cleanup-expired-reservations.ts
import { CronJob } from 'cron';

import type { ITimeSlotService } from '@/core/interfaces/services/i-time-slot-service';

import logger from '@/config/logger';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const timeSlotService = container.get<ITimeSlotService>(TYPES.TimeSlotService);

const cleanupJob = new CronJob('*/5 * * * *', async () => {
  try {
    await timeSlotService.releaseExpiredReservations();
    logger.info('Cleaned up expired time slot reservations');
  } catch (error) {
    logger.error('Error cleaning up expired reservations:', error);
  }
});

export function startCleanupJob() {
  cleanupJob.start();
}
