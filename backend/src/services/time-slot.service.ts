import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import { ITimeSlot } from '@/models/timeslots.model';
import { TimeSlotRepository } from '@/repositories/time-slot.repository';

export class TimeSlotService implements ITimeSlotService {
  private timeSlotRepository: TimeSlotRepository;

  constructor() {
    this.timeSlotRepository = new TimeSlotRepository();
  }

  async addTimeSlot(mentorId: string, date: Date, startTime: string): Promise<ITimeSlot> {
    // Validate startTime format (HH:mm)
    if (!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
      throw new Error('Invalid start time format. Use HH:mm.');
    }

    // Calculate endTime (1 hour later)
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + 1) % 24;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;

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

  async getAllTimeSlots(mentorId: string): Promise<ITimeSlot[]> {
    return await this.timeSlotRepository.find({ mentorId });
  }
}
