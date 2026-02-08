import { injectable } from "inversify";

import type { IBookingPaymentRepository } from "@/core/interfaces/repositories/i-booking-payment-repository";
import type { IBookingPayment } from "@/models/booking-payment.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { BookingPaymentModel } from "@/models/booking-payment.model";

@injectable()
export class BookingPaymentRepository
  extends BaseRepository<IBookingPayment>
  implements IBookingPaymentRepository {
  constructor() {
    super(BookingPaymentModel);
  }

  async createBookingPayment(data: Partial<IBookingPayment>): Promise<IBookingPayment> {
    return this.create(data);
  }
}
