import { ITimeSlot } from '@/models/timeslots.model';

export interface ITimeSlotService {
  addTimeSlot(mentorId: string, date: Date, startTime12Hr: string): Promise<ITimeSlot>;
  deleteTimeSlot(mentorId: string, slotId: string): Promise<ITimeSlot>;
  getTimeSlotsByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]>;
  getAllTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;
  getBookedTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;
  getMentorTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>>;
  bookTimeSlot(slotId: string, mentorId: string): Promise<ITimeSlot>;
  update(timeslot: string, data: Partial<ITimeSlot>): Promise<ITimeSlot | null>;
  findById(timeslot: string): Promise<ITimeSlot | null>;
  reserveTimeSlot(slotId: string, mentorId: string, expiresInMinutes: number): Promise<boolean>;
  isTimeSlotAvailable(slotId: string, mentorId: string): Promise<boolean>;
  releaseExpiredReservations(): Promise<void>;
}
