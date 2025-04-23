import { ITimeSlot } from '@/models/timeslots.model';

export interface ITimeSlotRepository {
  createMany(timeSlots: Partial<ITimeSlot>[]): Promise<ITimeSlot[]>;
  find(query: any): Promise<ITimeSlot[]>;
}
