import type { ITimeSlot } from "@/models/booking/timeslots.model";

import type { IBaseRepository } from "./i-base-repository";

export interface ITimeSlotRepository extends IBaseRepository<ITimeSlot> {
  findByMentorAndDate: (mentorId: string, date: Date) => Promise<ITimeSlot[]>;
  deleteByMentorAndSlotId: (mentorId: string, slotId: string) => Promise<ITimeSlot | null>;
  getAllTimeSlotsGroupedByDate: (mentorId: string) => Promise<Record<string, ITimeSlot[]>>;
  getUnbookedTimeSlotsForNext7Days: (mentorId: string) => Promise<Record<string, ITimeSlot[]>>;
  releaseExpiredReservations: () => Promise<void>;
}
