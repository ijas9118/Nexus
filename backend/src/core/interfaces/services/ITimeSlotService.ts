import { BaseService } from '@/core/abstracts/base.service';
import { ITimeSlot } from '@/models/timeslots.model';

export interface ITimeSlotService extends BaseService<ITimeSlot> {
  addTimeSlot(mentorId: string, date: Date, startTime12Hr: string): Promise<ITimeSlot>;

  deleteTimeSlot(mentorId: string, slotId: string): Promise<ITimeSlot>;

  getTimeSlotsByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]>;

  getAllTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;

  getBookedTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;

  getMentorTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;

  bookTimeSlot(slotId: string, mentorId: string): Promise<ITimeSlot>;
}
