// jobs/cleanup-expired-reservations.ts
import { CronJob } from 'cron';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import logger from '@/config/logger';

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
