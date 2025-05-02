import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import { TYPES } from '@/di/types';
import { ITimeSlot } from '@/models/timeslots.model';
import { TimeSlotRepository } from '@/repositories/time-slot.repository';
import CustomError from '@/utils/CustomError';
import dayjs from 'dayjs';
import { inject, injectable } from 'inversify';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

@injectable()
export class TimeSlotService implements ITimeSlotService {
  constructor(
    @inject(TYPES.TimeSlotRepository) private timeSlotRepository: TimeSlotRepository,
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  async addTimeSlot(mentorId: string, date: Date, startTime12Hr: string): Promise<ITimeSlot> {
    const mentor = await this.mentorService.getMentorDetails(mentorId);
    if (!mentor) {
      throw new CustomError('Mentor not found. Please make sure you are a registered mentor.');
    }

    // Validate 12-hour format with AM/PM
    const parsedStart = dayjs(startTime12Hr, 'hh:mm A');
    if (!parsedStart.isValid()) {
      throw new CustomError('Invalid start time format. Use hh:mm AM/PM.');
    }

    const startTime = parsedStart.format('hh:mm A');
    const endTime = parsedStart.add(1, 'hour').format('hh:mm A');

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
        throw new Error('Time slot overlaps with an existing slot.');
      }
      throw error;
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
}
