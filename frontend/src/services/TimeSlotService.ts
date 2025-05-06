import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { TimeSlot } from "@/types/mentor";

const TimeSlotService = {
  addTimeSlot: (date: string, startTime: string, mentorId: string) =>
    handleApi(() =>
      api.post<TimeSlot>("/mentor/time-slot", {
        date,
        startTime,
        mentorId,
      }),
    ),

  deleteTimeSlot: (slotId: string) =>
    handleApi(() => api.delete<TimeSlot>(`/mentor/time-slot/${slotId}`)),

  getTimeSlotsByDate: (date: string) =>
    handleApi(() =>
      api.get<TimeSlot[]>(`/mentor/time-slot/by-date`, {
        params: { date },
      }),
    ),

  getAllTimeSlots: () =>
    handleApi(() => api.get<Record<string, TimeSlot[]>>("/mentor/time-slot")),

  getBookedTimeSlots: () =>
    handleApi(() =>
      api.get<Record<string, TimeSlot[]>>("/mentor/time-slot/booked-time-slot"),
    ),

  getMentorTimeSlots: (mentorId: string) =>
    handleApi(() =>
      api.get<Record<string, TimeSlot[]>>(`/mentor/time-slot/${mentorId}`),
    ),
};

export default TimeSlotService;
