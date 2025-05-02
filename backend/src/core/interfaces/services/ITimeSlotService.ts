import { ITimeSlot } from '@/models/timeslots.model';

export interface ITimeSlotService {
  addTimeSlot(mentorId: string, date: Date, startTime12Hr: string): Promise<ITimeSlot>;

  deleteTimeSlot(mentorId: string, slotId: string): Promise<ITimeSlot>;

  getTimeSlotsByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]>;

  getAllTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;
}
