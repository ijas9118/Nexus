import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import { TYPES } from '@/di/types';
import { ITimeSlot } from '@/models/timeslots.model';
import { TimeSlotRepository } from '@/repositories/time-slot.repository';
import CustomError from '@/utils/CustomError';
import dayjs from 'dayjs';
import { inject, injectable } from 'inversify';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { StatusCodes } from 'http-status-codes';
import { BaseService } from '@/core/abstracts/base.service';
dayjs.extend(customParseFormat);

@injectable()
export class TimeSlotService extends BaseService<ITimeSlot> implements ITimeSlotService {
  constructor(
    @inject(TYPES.TimeSlotRepository) private timeSlotRepository: TimeSlotRepository,
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {
    super(timeSlotRepository);
  }

  async addTimeSlot(mentorId: string, date: Date, startTime12Hr: string): Promise<ITimeSlot> {
    const mentor = await this.mentorService.getMentorDetails(mentorId);
    if (!mentor) {
      throw new CustomError(
        'Mentor not found. Please make sure you are a registered mentor.',
        StatusCodes.BAD_REQUEST
      );
    }

    const slotDate = dayjs(date);

    // Validate 12-hour format with AM/PM
    const parsedStart = dayjs(startTime12Hr, 'hh:mm A');
    if (!parsedStart.isValid()) {
      throw new CustomError('Invalid start time format. Use hh:mm AM/PM.', StatusCodes.BAD_REQUEST);
    }

    // Combine date and time for comparison
    const slotDateTime = slotDate
      .set('hour', parsedStart.hour())
      .set('minute', parsedStart.minute());

    // Check if the slot is in the past
    if (slotDateTime.isBefore(dayjs())) {
      throw new CustomError('Cannot create a time slot in the past.', StatusCodes.BAD_REQUEST);
    }

    const startTime = parsedStart.format('hh:mm A');
    const endTime = parsedStart.add(1, 'hour').format('hh:mm A');
    const slotEndDateTime = slotDateTime.add(1, 'hour');

    // Check for overlapping or closely timed slots
    const existingSlots = await this.timeSlotRepository.find({
      mentorId,
      date: {
        $gte: slotDate.startOf('day').toDate(),
        $lte: slotDate.endOf('day').toDate(),
      },
    });

    for (const slot of existingSlots) {
      const existingStart = dayjs(
        `${slot.date.toISOString().split('T')[0]} ${slot.startTime}`,
        'YYYY-MM-DD hh:mm A'
      );
      const existingEnd = dayjs(
        `${slot.date.toISOString().split('T')[0]} ${slot.endTime}`,
        'YYYY-MM-DD hh:mm A'
      );

      // Check if new slot starts within an existing slot
      if (
        slotDateTime.isSame(existingStart) ||
        (slotDateTime.isAfter(existingStart) && slotDateTime.isBefore(existingEnd))
      ) {
        throw new CustomError('Time slot overlaps with an existing slot.', StatusCodes.CONFLICT);
      }

      // Check if new slot starts within 1 hour before an existing slot
      const oneHourBeforeExisting = existingStart.subtract(1, 'hour');
      if (slotDateTime.isAfter(oneHourBeforeExisting) && slotDateTime.isBefore(existingStart)) {
        throw new CustomError(
          'Time slot is too close to an existing slot (must be at least 1 hour before).',
          StatusCodes.CONFLICT
        );
      }

      // Check if new slot's end time overlaps with an existing slot
      if (
        slotEndDateTime.isAfter(existingStart) &&
        slotEndDateTime.isBefore(existingEnd) &&
        !slotEndDateTime.isSame(existingStart)
      ) {
        throw new CustomError(
          'Time slot’s end time overlaps with an existing slot.',
          StatusCodes.CONFLICT
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
    } catch (error: any) {
      if (error.code === 11000) {
        throw new CustomError('Time slot conflicts with an existing slot.', StatusCodes.CONFLICT);
      }
      throw new CustomError('An unexpected error occurred.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTimeSlot(mentorId: string, slotId: string): Promise<ITimeSlot> {
    const timeSlot = await this.timeSlotRepository.deleteByMentorAndSlotId(mentorId, slotId);
    if (!timeSlot) {
      throw new Error('Time slot not found or cannot be deleted (already booked).');
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
      throw new CustomError('Mentor not found.', StatusCodes.BAD_REQUEST);
    }

    // Get unbooked time slots for the next 7 days
    return await this.timeSlotRepository.getUnbookedTimeSlotsForNext7Days(mentorId);
  }

  async bookTimeSlot(slotId: string, mentorId: string): Promise<ITimeSlot> {
    // Find the time slot by ID and mentorId
    const timeSlot = await this.timeSlotRepository.findById(slotId);
    if (!timeSlot) {
      throw new CustomError('Time slot not found.', StatusCodes.NOT_FOUND);
    }

    // Verify the time slot belongs to the mentor
    if (timeSlot.mentorId.toString() !== mentorId) {
      throw new CustomError(
        'Time slot does not belong to the specified mentor.',
        StatusCodes.FORBIDDEN
      );
    }

    // Check if the time slot is already booked
    if (timeSlot.isBooked) {
      throw new CustomError('Time slot is already booked.', StatusCodes.CONFLICT);
    }

    // Mark the time slot as booked
    timeSlot.isBooked = true;
    const updatedTimeSlot = await this.timeSlotRepository.update(slotId, { isBooked: true });
    if (!updatedTimeSlot) {
      throw new CustomError('Failed to update the time slot.', StatusCodes.NOT_FOUND);
    }
    return updatedTimeSlot;
  }
}
