import { IBookingPayment } from '@/models/bookingPayment.model';

export interface IBookingPaymentRepository {
  createBookingPayment(data: Partial<IBookingPayment>): Promise<IBookingPayment>;
  findById(id: string): Promise<IBookingPayment | null>;
}
