import { inject, injectable } from 'inversify';
import { IBookingService } from '@/core/interfaces/services/IBookingService';
import { IBookingRepository } from '@/core/interfaces/repositories/IBookingRepository';
import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import { TYPES } from '@/di/types';
import { IBooking } from '@/models/booking.model';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import dayjs from 'dayjs';

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.TimeSlotService) private timeSlotService: ITimeSlotService
  ) {}

  async getUpcomingBookings(): Promise<IBooking[]> {
    return this.bookingRepository.getUpcomingBookings();
  }

  async getCompletedBookings(): Promise<IBooking[]> {
    return this.bookingRepository.getCompletedBookings();
  }

  async getFilteredBookings(date?: Date, mentorshipTypeId?: string): Promise<IBooking[]> {
    return this.bookingRepository.getFilteredBookings(date, mentorshipTypeId);
  }

  async rescheduleBooking(
    bookingId: string,
    newTimeSlotId: string,
    newBookingDate: Date
  ): Promise<IBooking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError('Booking not found.', StatusCodes.NOT_FOUND);
    }

    if (booking.status === 'completed') {
      throw new CustomError('Cannot reschedule a completed booking.', StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.findById(newTimeSlotId);
    if (!timeSlot) {
      throw new CustomError('Time slot not found.', StatusCodes.NOT_FOUND);
    }

    if (timeSlot.isBooked) {
      throw new CustomError('Time slot is already booked.', StatusCodes.CONFLICT);
    }

    const bookingDate = dayjs(newBookingDate);
    if (bookingDate.isBefore(dayjs().startOf('day'))) {
      throw new CustomError('Cannot reschedule to a past date.', StatusCodes.BAD_REQUEST);
    }

    if (booking.timeSlot.toString() !== newTimeSlotId) {
      await this.timeSlotService.update(booking.timeSlot.toString(), { isBooked: false });
    }

    await this.timeSlotService.bookTimeSlot(newTimeSlotId, timeSlot.mentorId.toString());

    const updatedBooking = await this.bookingRepository.update(bookingId, {
      timeSlot: newTimeSlotId,
      bookingDate: newBookingDate,
      status: 'pending',
    });

    if (!updatedBooking) {
      throw new CustomError('Failed to update booking.', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedBooking;
  }

  async confirmBooking(bookingId: string): Promise<IBooking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError('Booking not found.', StatusCodes.NOT_FOUND);
    }

    if (booking.status !== 'pending') {
      throw new CustomError('Only pending bookings can be confirmed.', StatusCodes.BAD_REQUEST);
    }

    const updatedBooking = await this.bookingRepository.update(bookingId, {
      status: 'confirmed',
    });

    if (!updatedBooking) {
      throw new CustomError('Failed to confirm booking.', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedBooking;
  }
}
