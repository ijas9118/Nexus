import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { TimeSlot } from "@/types/mentor";
import { TIME_SLOT_ROUTES } from "@/utils/constants";

const TimeSlotService = {
  addTimeSlot: (date: string, startTime: string, mentorId: string) =>
    handleApi(() =>
      api.post<TimeSlot>(TIME_SLOT_ROUTES.BASE, {
        date,
        startTime,
        mentorId,
      }),
    ),

  deleteTimeSlot: (slotId: string) =>
    handleApi(() => api.delete<TimeSlot>(`${TIME_SLOT_ROUTES.BASE}/${slotId}`)),

  getTimeSlotsByDate: (date: string) =>
    handleApi(() =>
      api.get<TimeSlot[]>(TIME_SLOT_ROUTES.BY_DATE, {
        params: { date },
      }),
    ),

  getAllTimeSlots: () =>
    handleApi(() => api.get<Record<string, TimeSlot[]>>(TIME_SLOT_ROUTES.BASE)),

  getBookedTimeSlots: () =>
    handleApi(() =>
      api.get<Record<string, TimeSlot[]>>(TIME_SLOT_ROUTES.BOOKED),
    ),

  getMentorTimeSlots: (mentorId: string) =>
    handleApi(() =>
      api.get<Record<string, TimeSlot[]>>(
        `${TIME_SLOT_ROUTES.BASE}/${mentorId}`,
      ),
    ),
};

export default TimeSlotService;
