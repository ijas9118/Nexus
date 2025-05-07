import { BaseRepository } from '@/core/abstracts/base.repository';
import { IBookingRepository } from '@/core/interfaces/repositories/IBookingRepository';
import { IBooking, BookingModel } from '@/models/booking.model';
import { injectable } from 'inversify';

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(BookingModel);
  }

  async createBooking(data: Partial<IBooking>): Promise<IBooking> {
    return this.create(data);
  }
}
