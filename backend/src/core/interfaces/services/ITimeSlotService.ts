import { ITimeSlot } from '@/models/timeslots.model';

export interface ITimeSlotService {
  addTimeSlot(mentorId: string, date: Date, startTime: string): Promise<ITimeSlot>;

  deleteTimeSlot(mentorId: string, slotId: string): Promise<ITimeSlot>;

  getTimeSlotsByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]>;

  getAllTimeSlots(mentorId: string): Promise<ITimeSlot[]>;
}
