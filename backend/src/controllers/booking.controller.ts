import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IBookingController } from '@/core/interfaces/controllers/IBookingController';
import { IBookingService } from '@/core/interfaces/services/IBookingService';
import { TYPES } from '@/di/types';
import { StatusCodes } from 'http-status-codes';
import CustomError from '@/utils/CustomError';
import dayjs from 'dayjs';
import asyncHandler from 'express-async-handler';
import { RescheduleBookingRequestDTO } from '@/dtos/requests/booking.dto';

@injectable()
export class BookingController implements IBookingController {
  constructor(@inject(TYPES.BookingService) private bookingService: IBookingService) {}

  getUpcomingBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookings = await this.bookingService.getUpcomingBookings();
    console.log(bookings);
    res.status(StatusCodes.OK).json(bookings);
  });

  getCompletedBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookings = await this.bookingService.getCompletedBookings();
    res.status(StatusCodes.OK).json(bookings);
  });

  rescheduleBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const { timeSlotId, bookingDate } = req.body as RescheduleBookingRequestDTO;

    // Validate input
    if (!timeSlotId || !bookingDate) {
      throw new CustomError('timeSlotId and bookingDate are required.', StatusCodes.BAD_REQUEST);
    }

    // Validate date format
    const parsedDate = dayjs(bookingDate);
    if (!parsedDate.isValid()) {
      throw new CustomError(
        'Invalid bookingDate format. Use ISO 8601 (e.g., "2025-05-10T00:00:00.000Z").',
        StatusCodes.BAD_REQUEST
      );
    }

    const updatedBooking = await this.bookingService.rescheduleBooking(
      bookingId,
      timeSlotId,
      parsedDate.toDate()
    );
    res.status(StatusCodes.OK).json(updatedBooking);
  });

  getFilteredBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { date, mentorshipTypeId } = req.query;

    // Validate date if provided
    let parsedDate: Date | undefined;
    if (date) {
      const tempDate = dayjs(date as string);
      if (!tempDate.isValid()) {
        throw new CustomError(
          'Invalid date format. Use ISO 8601 (e.g., "2025-05-10T00:00:00.000Z").',
          StatusCodes.BAD_REQUEST
        );
      }
      parsedDate = tempDate.toDate();
    }

    const bookings = await this.bookingService.getFilteredBookings(
      parsedDate,
      mentorshipTypeId as string
    );
    res.status(StatusCodes.OK).json(bookings);
  });

  confirmBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;

    const updatedBooking = await this.bookingService.confirmBooking(bookingId);
    res.status(StatusCodes.OK).json(updatedBooking);
  });
}
