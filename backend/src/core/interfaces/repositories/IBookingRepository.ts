import { IBooking } from '@/models/booking.model';

export interface IBookingRepository {
  createBooking(data: Partial<IBooking>): Promise<IBooking>;
  findById(id: string): Promise<IBooking | null>;
  update(id: string, data: Partial<IBooking>): Promise<IBooking | null>;
}
