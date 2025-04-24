import { BaseRepository } from '@/core/abstracts/base.repository';
import { ITimeSlotRepository } from '@/core/interfaces/repositories/ITimeSlotRepository';
import { ITimeSlot, TimeSlotModel } from '@/models/timeslots.model';

export class TimeSlotRepository extends BaseRepository<ITimeSlot> implements ITimeSlotRepository {
  constructor() {
    super(TimeSlotModel);
  }

  async findByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]> {
    return this.find({
      mentorId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    });
  }

  async deleteByMentorAndSlotId(mentorId: string, slotId: string): Promise<ITimeSlot | null> {
    return this.findOneAndDelete({ _id: slotId, mentorId, isBooked: false });
  }
}
