import type { Request, Response } from "express";

import dayjs from "dayjs";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IBookingController } from "@/core/interfaces/controllers/i-booking-controller";
import type { IBookingService } from "@/core/interfaces/services/i-booking-service";
import type { RescheduleBookingRequestDTO } from "@/dtos/requests/booking.dto";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

@injectable()
export class BookingController implements IBookingController {
  constructor(@inject(TYPES.BookingService) private _bookingService: IBookingService) {}

  getBookingByMeetUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { meetUrl } = req.body;
    const userId = req.user?._id as string;

    if (!userId) {
      res.status(401).json({ error: MESSAGES.BOOKING_MESSAGES.AUTH_REQUIRED });
      return;
    }

    const booking = await this._bookingService.getBookingByMeetUrl(meetUrl, userId);

    if (!booking) {
      res.status(404).json({ error: MESSAGES.BOOKING_MESSAGES.BOOKING_NOT_FOUND });
      return;
    }

    res.json({
      success: true,
      data: {
        _id: booking._id,
        mentorId: booking.mentorId,
        userId: booking.userId,
        mentorUserId: booking.mentorUserId,
        mentorshipType: booking.mentorshipType,
        timeSlot: booking.timeSlot,
        bookingDate: booking.bookingDate,
        reason: booking.reason,
        status: booking.status,
        meetUrl: booking.meetUrl,
      },
    });
  });

  getUpcomingBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookings = await this._bookingService.getUpcomingBookings();
    res.status(StatusCodes.OK).json(bookings);
  });

  getCompletedBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookings = await this._bookingService.getCompletedBookings();
    res.status(StatusCodes.OK).json(bookings);
  });

  rescheduleBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const { timeSlotId, bookingDate } = req.body as RescheduleBookingRequestDTO;

    // Validate input
    if (!timeSlotId || !bookingDate) {
      throw new CustomError(
        MESSAGES.BOOKING_MESSAGES.RESCHEDULE_FIELDS_REQUIRED,
        StatusCodes.BAD_REQUEST,
      );
    }

    // Validate date format
    const parsedDate = dayjs(bookingDate);
    if (!parsedDate.isValid()) {
      throw new CustomError(MESSAGES.BOOKING_MESSAGES.INVALID_DATE_FORMAT, StatusCodes.BAD_REQUEST);
    }

    const updatedBooking = await this._bookingService.rescheduleBooking(
      bookingId as string,
      timeSlotId,
      parsedDate.toDate(),
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
          MESSAGES.BOOKING_MESSAGES.INVALID_DATE_FORMAT,
          StatusCodes.BAD_REQUEST,
        );
      }
      parsedDate = tempDate.toDate();
    }

    const bookings = await this._bookingService.getFilteredBookings(
      parsedDate,
      mentorshipTypeId as string,
    );
    res.status(StatusCodes.OK).json(bookings);
  });

  confirmBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;

    const updatedBooking = await this._bookingService.confirmBooking(bookingId as string);
    res.status(StatusCodes.OK).json(updatedBooking);
  });
}
