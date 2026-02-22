import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { IBooking } from "@/types/booking";
import { BOOKING_ROUTES } from "@/utils/constants";

const BookingService = {
  // Get upcoming bookings (pending or confirmed)
  getUpcomingBookings: () =>
    handleApi(() => api.get<IBooking[]>(BOOKING_ROUTES.UPCOMING)),

  // Get completed bookings
  getCompletedBookings: () =>
    handleApi(() => api.get<IBooking[]>(BOOKING_ROUTES.COMPLETED)),

  // Reschedule a booking
  rescheduleBooking: (
    bookingId: string,
    data: { timeSlotId: string; bookingDate: string },
  ) =>
    handleApi(() =>
      api.patch<IBooking>(
        `${BOOKING_ROUTES.BASE}/${bookingId}/reschedule`,
        data,
      ),
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
      return api.get<IBooking[]>(BOOKING_ROUTES.FILTER, { params });
    }),

  // Confirm a pending booking
  confirmBooking: (bookingId: string) =>
    handleApi(() =>
      api.patch<IBooking>(`${BOOKING_ROUTES.BASE}/${bookingId}/confirm`),
    ),
};

export default BookingService;
