import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorService } from "@/core/interfaces/services/i-mentor-service";
import type { ITimeSlotService } from "@/core/interfaces/services/i-time-slot-service";
import type { ITimeSlot } from "@/models/booking/timeslots.model";
import type { TimeSlotRepository } from "@/repositories/booking/time-slot.repository";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

dayjs.extend(customParseFormat);

const { MENTOR_MESSAGES, BOOKING_MESSAGES, COMMON_MESSAGES } = MESSAGES;

@injectable()
export class TimeSlotService implements ITimeSlotService {
  constructor(
    @inject(TYPES.TimeSlotRepository) private timeSlotRepository: TimeSlotRepository,
    @inject(TYPES.MentorService) private mentorService: IMentorService,
  ) {}

  async addTimeSlot(mentorId: string, date: Date, startTime12Hr: string): Promise<ITimeSlot> {
    const mentor = await this.mentorService.getMentorDetails(mentorId);
    if (!mentor) {
      throw new CustomError(
        MENTOR_MESSAGES.REGISTERED_MENTOR_REQUIRED,
        StatusCodes.BAD_REQUEST,
      );
    }

    const slotDate = dayjs(date);

    // Validate 12-hour format with AM/PM
    const parsedStart = dayjs(startTime12Hr, "hh:mm A");
    if (!parsedStart.isValid()) {
      throw new CustomError(MENTOR_MESSAGES.INVALID_TIME_FORMAT, StatusCodes.BAD_REQUEST);
    }

    // Combine date and time for comparison
    const slotDateTime = slotDate
      .set("hour", parsedStart.hour())
      .set("minute", parsedStart.minute());

    // Check if the slot is in the past
    if (slotDateTime.isBefore(dayjs())) {
      throw new CustomError(MENTOR_MESSAGES.PAST_SLOT, StatusCodes.BAD_REQUEST);
    }

    const startTime = parsedStart.format("hh:mm A");
    const endTime = parsedStart.add(1, "hour").format("hh:mm A");
    const slotEndDateTime = slotDateTime.add(1, "hour");

    // Check for overlapping or closely timed slots
    const existingSlots = await this.timeSlotRepository.find({
      mentorId,
      date: {
        $gte: slotDate.startOf("day").toDate(),
        $lte: slotDate.endOf("day").toDate(),
      },
    });

    for (const slot of existingSlots) {
      const existingStart = dayjs(
        `${slot.date.toISOString().split("T")[0]} ${slot.startTime}`,
        "YYYY-MM-DD hh:mm A",
      );
      const existingEnd = dayjs(
        `${slot.date.toISOString().split("T")[0]} ${slot.endTime}`,
        "YYYY-MM-DD hh:mm A",
      );

      // Check if new slot starts within an existing slot
      if (
        slotDateTime.isSame(existingStart)
        || (slotDateTime.isAfter(existingStart) && slotDateTime.isBefore(existingEnd))
      ) {
        throw new CustomError(MENTOR_MESSAGES.SLOT_OVERLAP, StatusCodes.CONFLICT);
      }

      // Check if new slot starts within 1 hour before an existing slot
      const oneHourBeforeExisting = existingStart.subtract(1, "hour");
      if (slotDateTime.isAfter(oneHourBeforeExisting) && slotDateTime.isBefore(existingStart)) {
        throw new CustomError(
          MENTOR_MESSAGES.SLOT_TOO_CLOSE,
          StatusCodes.CONFLICT,
        );
      }

      // Check if new slot's end time overlaps with an existing slot
      if (
        slotEndDateTime.isAfter(existingStart)
        && slotEndDateTime.isBefore(existingEnd)
        && !slotEndDateTime.isSame(existingStart)
      ) {
        throw new CustomError(
          MENTOR_MESSAGES.SLOT_END_OVERLAP,
          StatusCodes.CONFLICT,
        );
      }
    }

    const timeSlotData: Partial<ITimeSlot> = {
      mentorId,
      date,
      startTime,
      endTime,
      isBooked: false,
    };

    try {
      return await this.timeSlotRepository.create(timeSlotData);
    }
    catch (error: any) {
      if (error.code === 11000) {
        throw new CustomError(MENTOR_MESSAGES.SLOT_CONFLICT, StatusCodes.CONFLICT);
      }
      throw new CustomError(COMMON_MESSAGES.UNEXPECTED_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTimeSlot(mentorId: string, slotId: string): Promise<ITimeSlot> {
    const timeSlot = await this.timeSlotRepository.deleteByMentorAndSlotId(mentorId, slotId);
    if (!timeSlot) {
      throw new CustomError(BOOKING_MESSAGES.SLOT_NOT_FOUND_OR_BOOKED, StatusCodes.NOT_FOUND);
    }
    return timeSlot;
  }

  async getTimeSlotsByMentorAndDate(mentorId: string, date: Date): Promise<ITimeSlot[]> {
    return await this.timeSlotRepository.findByMentorAndDate(mentorId, date);
  }

  async getAllTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>> {
    return await this.timeSlotRepository.getAllTimeSlotsGroupedByDate(mentorId);
  }

  async getBookedTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>> {
    return await this.timeSlotRepository.getBookedTimeSlots(mentorId);
  }

  async getMentorTimeSlots(mentorId: string): Promise<Record<string, ITimeSlot[]>> {
    // Validate mentor existence
    const mentor = await this.mentorService.getMentorDetails(mentorId);
    if (!mentor) {
      throw new CustomError(BOOKING_MESSAGES.TIME_SLOT_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    // Get unbooked time slots for the next 7 days
    return await this.timeSlotRepository.getUnbookedTimeSlotsForNext7Days(mentorId);
  }

  async bookTimeSlot(slotId: string, mentorId: string): Promise<ITimeSlot> {
    const timeSlot = await this.timeSlotRepository.findById(slotId);
    if (!timeSlot) {
      throw new CustomError(BOOKING_MESSAGES.TIME_SLOT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (timeSlot.mentorId.toString() !== mentorId) {
      throw new CustomError(
        BOOKING_MESSAGES.SLOT_NOT_BELONG_TO_MENTOR,
        StatusCodes.FORBIDDEN,
      );
    }

    if (timeSlot.isBooked) {
      throw new CustomError(BOOKING_MESSAGES.TIME_SLOT_ALREADY_BOOKED, StatusCodes.CONFLICT);
    }

    const updatedTimeSlot = await this.timeSlotRepository.update(slotId, { isBooked: true });
    if (!updatedTimeSlot) {
      throw new CustomError(BOOKING_MESSAGES.SLOT_UPDATE_FAILED, StatusCodes.NOT_FOUND);
    }
    return updatedTimeSlot;
  }

  async reserveTimeSlot(
    slotId: string,
    mentorId: string,
    expiresInMinutes: number,
  ): Promise<boolean> {
    const timeSlot = await this.timeSlotRepository.findById(slotId);
    if (!timeSlot || timeSlot.mentorId.toString() !== mentorId) {
      return false;
    }

    if (timeSlot.status !== "available") {
      return false;
    }

    const reservedUntil = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const updated = await this.timeSlotRepository.update(slotId, {
      status: "reserved",
      reservedUntil,
    });

    return !!updated;
  }

  async isTimeSlotAvailable(slotId: string, mentorId: string): Promise<boolean> {
    const timeSlot = await this.timeSlotRepository.findById(slotId);
    if (!timeSlot || timeSlot.mentorId.toString() !== mentorId) {
      return false;
    }

    if (timeSlot.status === "available") {
      return true;
    }

    if (
      timeSlot.status === "reserved"
      && timeSlot.reservedUntil
      && new Date() > timeSlot.reservedUntil
    ) {
      // Release expired reservation
      await this.timeSlotRepository.update(slotId, {
        status: "available",
        reservedUntil: undefined,
      });
      return true;
    }

    return false;
  }

  async releaseExpiredReservations(): Promise<void> {
    await this.timeSlotRepository.releaseExpiredReservations();
  }

  async update(timeslot: string, data: Partial<ITimeSlot>): Promise<ITimeSlot | null> {
    return await this.timeSlotRepository.update(timeslot, data);
  }

  async findById(timeslot: string): Promise<ITimeSlot | null> {
    return await this.timeSlotRepository.findById(timeslot);
  }
}
