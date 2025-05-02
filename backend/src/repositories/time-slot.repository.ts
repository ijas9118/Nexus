import { BaseRepository } from '@/core/abstracts/base.repository';
import { ITimeSlotRepository } from '@/core/interfaces/repositories/ITimeSlotRepository';
import { ITimeSlot, TimeSlotModel } from '@/models/timeslots.model';
import dayjs from 'dayjs';

export class TimeSlotRepository extends BaseRepository<ITimeSlot> implements ITimeSlotRepository {
  constructor() {
    super(TimeSlotModel);
  }

  async findByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]> {
    const slots = await this.find({
      mentorId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    });

    // Sort by actual time (using dayjs)
    return slots.sort((a, b) => {
      const parseTime = (time: string) => {
        return dayjs(time, 'hh:mm A').valueOf(); // Convert time to milliseconds
      };

      return parseTime(a.startTime) - parseTime(b.startTime);
    });
  }

  async deleteByMentorAndSlotId(mentorId: string, slotId: string): Promise<ITimeSlot | null> {
    return this.findOneAndDelete({ _id: slotId, mentorId, isBooked: false });
  }

  async getAllTimeSlotsGroupedByDate(mentorId: string): Promise<Record<string, ITimeSlot[]>> {
    const slots = await this.find({ mentorId });

    const now = dayjs(); // Current time
    const grouped: Record<string, ITimeSlot[]> = {};

    for (const slot of slots) {
      // Combine date + startTime to get full timestamp
      const slotDateTime = dayjs(
        `${slot.date.toISOString().split('T')[0]} ${slot.startTime}`,
        'YYYY-MM-DD hh:mm A'
      );

      // Filter out expired and unbooked time slots
      if (!slot.isBooked && slotDateTime.isBefore(now)) {
        continue; // Skip this one
      }

      const dateKey = slot.date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(slot);
    }

    // Sort time slots within each date
    for (const date in grouped) {
      grouped[date].sort((a, b) => {
        const parseTime = (time: string) => dayjs(time, 'hh:mm A').valueOf();
        return parseTime(a.startTime) - parseTime(b.startTime);
      });
    }

    // Sort the date groups
    const sortedGrouped: Record<string, ITimeSlot[]> = {};
    Object.keys(grouped)
      .sort() // '2025-05-01' before '2025-05-02'
      .forEach((date) => {
        sortedGrouped[date] = grouped[date];
      });

    return sortedGrouped;
  }
}
