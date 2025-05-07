import { BaseRepository } from '@/core/abstracts/base.repository';
import { IBookingPaymentRepository } from '@/core/interfaces/repositories/IBookingPaymentRepository';
import { IBookingPayment, BookingPaymentModel } from '@/models/bookingPayment.model';
import { injectable } from 'inversify';

@injectable()
export class BookingPaymentRepository
  extends BaseRepository<IBookingPayment>
  implements IBookingPaymentRepository
{
  constructor() {
    super(BookingPaymentModel);
  }

  async createBookingPayment(data: Partial<IBookingPayment>): Promise<IBookingPayment> {
    return this.create(data);
  }
}
