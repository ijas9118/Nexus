import type { IBookingPayment } from '@/models/booking-payment.model';

export interface IBookingPaymentRepository {
  createBookingPayment: (data: Partial<IBookingPayment>) => Promise<IBookingPayment>;
  findById: (id: string) => Promise<IBookingPayment | null>;
}
