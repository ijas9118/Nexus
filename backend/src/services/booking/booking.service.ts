import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IBookingRepository } from "@/core/interfaces/repositories/i-booking-repository";
import type { IBookingService } from "@/core/interfaces/services/i-booking-service";
import type { ITimeSlotService } from "@/core/interfaces/services/i-time-slot-service";
import type { IBooking } from "@/models/booking/booking.model";

import { TYPES } from "@/di/types";
import { BookingModel } from "@/models/booking/booking.model";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { BOOKING_MESSAGES } = MESSAGES;

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.TimeSlotService) private timeSlotService: ITimeSlotService,
  ) {}

  async getUpcomingBookings(): Promise<IBooking[]> {
    return this.bookingRepository.getUpcomingBookings();
  }

  async getBookingByMeetUrl(meetUrl: string, userId: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOne({ meetUrl })
      .populate("mentorId userId mentorUserId mentorshipType timeSlot")
      .exec();

    if (!booking) {
      return null;
    }

    // Restrict access to the booking's user or mentor
    if (booking.userId.toString() !== userId && booking.mentorUserId.toString() !== userId) {
      return null;
    }

    return booking;
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
    newBookingDate: Date,
  ): Promise<IBooking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(BOOKING_MESSAGES.BOOKING_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (booking.status === "completed") {
      throw new CustomError(BOOKING_MESSAGES.CANNOT_RESCHEDULE_COMPLETED, StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.findById(newTimeSlotId);
    if (!timeSlot) {
      throw new CustomError(BOOKING_MESSAGES.TIME_SLOT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (timeSlot.isBooked) {
      throw new CustomError(BOOKING_MESSAGES.TIME_SLOT_ALREADY_BOOKED, StatusCodes.CONFLICT);
    }

    const bookingDate = dayjs(newBookingDate);
    if (bookingDate.isBefore(dayjs().startOf("day"))) {
      throw new CustomError(BOOKING_MESSAGES.PAST_DATE_RESCHEDULE, StatusCodes.BAD_REQUEST);
    }

    if (booking.timeSlot.toString() !== newTimeSlotId) {
      await this.timeSlotService.update(booking.timeSlot.toString(), { isBooked: false });
    }

    await this.timeSlotService.bookTimeSlot(newTimeSlotId, timeSlot.mentorId.toString());

    const updatedBooking = await this.bookingRepository.update(bookingId, {
      timeSlot: newTimeSlotId,
      bookingDate: newBookingDate,
      status: "pending",
    });

    if (!updatedBooking) {
      throw new CustomError(BOOKING_MESSAGES.UPDATE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedBooking;
  }

  async confirmBooking(bookingId: string): Promise<IBooking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(BOOKING_MESSAGES.BOOKING_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (booking.status !== "pending") {
      throw new CustomError(BOOKING_MESSAGES.ONLY_PENDING_CONFIRM, StatusCodes.BAD_REQUEST);
    }

    const updatedBooking = await this.bookingRepository.update(bookingId, {
      status: "confirmed",
    });

    if (!updatedBooking) {
      throw new CustomError(BOOKING_MESSAGES.CONFIRM_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedBooking;
  }

  async getBookingById(bookingId: string): Promise<IBooking | null> {
    return this.bookingRepository.findById(bookingId);
  }
}
