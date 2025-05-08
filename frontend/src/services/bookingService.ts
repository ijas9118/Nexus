import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { IBooking } from "@/types/booking";

const BookingService = {
  // Get upcoming bookings (pending or confirmed)
  getUpcomingBookings: () =>
    handleApi(() => api.get<IBooking[]>("/bookings/upcoming")),

  // Get completed bookings
  getCompletedBookings: () =>
    handleApi(() => api.get<IBooking[]>("/bookings/completed")),

  // Reschedule a booking
  rescheduleBooking: (
    bookingId: string,
    data: { timeSlotId: string; bookingDate: string },
  ) =>
    handleApi(() =>
      api.patch<IBooking>(`/bookings/${bookingId}/reschedule`, data),
    ),

  // Get filtered bookings by date and/or mentorshipTypeId
  getFilteredBookings: (filters: {
    date?: string;
    mentorshipTypeId?: string;
  }) =>
    handleApi(() => {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.mentorshipTypeId)
        params.append("mentorshipTypeId", filters.mentorshipTypeId);
      return api.get<IBooking[]>(`/bookings/filter`, { params });
    }),

  // Confirm a pending booking
  confirmBooking: (bookingId: string) =>
    handleApi(() => api.patch<IBooking>(`/bookings/${bookingId}/confirm`)),
};

export default BookingService;
