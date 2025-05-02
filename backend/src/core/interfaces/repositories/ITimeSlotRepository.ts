import { ITimeSlot } from '@/models/timeslots.model';
import { IBaseRepository } from './IBaseRepository';

export interface ITimeSlotRepository extends IBaseRepository<ITimeSlot> {
  findByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]>;
  deleteByMentorAndSlotId(mentorId: string, slotId: string): Promise<ITimeSlot | null>;
  getAllTimeSlotsGroupedByDate(mentorId: string): Promise<Record<string, ITimeSlot[]>>;
}
