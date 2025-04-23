import { BaseRepository } from '@/core/abstracts/base.repository';
import { ITimeSlotRepository } from '@/core/interfaces/repositories/ITimeSlotRepository';
import { ITimeSlot, TimeSlotModel } from '@/models/timeslots.model';
import { injectable } from 'inversify';
import { ClientSession } from 'mongoose';

@injectable()
export class TimeSlotRepository extends BaseRepository<ITimeSlot> implements ITimeSlotRepository {
  constructor() {
    super(TimeSlotModel);
  }

  async createMany(timeSlots: Partial<ITimeSlot>[], session?: ClientSession): Promise<ITimeSlot[]> {
    return await this.model.insertMany(timeSlots, { session });
  }

  async find(query: any): Promise<ITimeSlot[]> {
    return await this.model.find(query).exec();
  }
}
