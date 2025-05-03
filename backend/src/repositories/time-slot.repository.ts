import { BaseRepository } from '@/core/abstracts/base.repository';
import { ITimeSlotRepository } from '@/core/interfaces/repositories/ITimeSlotRepository';
import { ITimeSlot, TimeSlotModel } from '@/models/timeslots.model';
import dayjs from 'dayjs';

export class TimeSlotRepository extends BaseRepository<ITimeSlot> implements ITimeSlotRepository {
  constructor() {
    super(TimeSlotModel);
  }

  async findByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const slots = await this.find({
      mentorId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const now = dayjs();

    const filtered = slots.filter((slot) => {
      const slotDate = slot.date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const slotDateTime = dayjs(`${slotDate} ${slot.startTime}`, 'YYYY-MM-DD hh:mm A');

      // Keep the slot if it's booked OR still in the future
      return slot.isBooked || slotDateTime.isAfter(now);
    });

    // Sort by start time
    return filtered.sort((a, b) => {
      const parseTime = (time: string) => dayjs(time, 'hh:mm A').valueOf();
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

      if (slotDateTime.isBefore(now)) {
        continue;
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

  async getBookedTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>> {
    const slots = await this.find({
      mentorId,
      isBooked: true,
    });

    const grouped: Record<string, ITimeSlot[]> = {};

    for (const slot of slots) {
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

    // Sort date groups
    const sortedGrouped: Record<string, ITimeSlot[]> = {};
    Object.keys(grouped)
      .sort() // Dates are in ISO format, so string sort works
      .forEach((date) => {
        sortedGrouped[date] = grouped[date];
      });

    return sortedGrouped;
  }
}
