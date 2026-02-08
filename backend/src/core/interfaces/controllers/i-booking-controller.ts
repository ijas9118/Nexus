import type { RequestHandler } from 'express';

export interface IBookingController {
  getUpcomingBookings: RequestHandler;
  getCompletedBookings: RequestHandler;
  rescheduleBooking: RequestHandler;
  getFilteredBookings: RequestHandler;
  confirmBooking: RequestHandler;
  getBookingByMeetUrl: RequestHandler;
}
