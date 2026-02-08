import type { IBooking } from '@/models/booking.model';

export interface IBookingService {
  getUpcomingBookings: () => Promise<IBooking[]>;
  getCompletedBookings: () => Promise<IBooking[]>;
  rescheduleBooking: (
    bookingId: string,
    newTimeSlotId: string,
    newBookingDate: Date
  ) => Promise<IBooking>;
  getFilteredBookings: (date?: Date, mentorshipTypeId?: string) => Promise<IBooking[]>;
  confirmBooking: (bookingId: string) => Promise<IBooking>;
  getBookingById: (bookingId: string) => Promise<IBooking | null>;
  getBookingByMeetUrl: (meetUrl: string, userId: string) => Promise<IBooking | null>;
}
