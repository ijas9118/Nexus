import { BaseRepository } from '@/core/abstracts/base.repository';
import { IBookingRepository } from '@/core/interfaces/repositories/IBookingRepository';
import { IBooking, BookingModel } from '@/models/booking.model';
import dayjs from 'dayjs';
import { injectable } from 'inversify';

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(BookingModel);
  }

  async createBooking(data: Partial<IBooking>): Promise<IBooking> {
    return this.create(data);
  }

  async getUpcomingBookings(): Promise<IBooking[]> {
    const today = dayjs().startOf('day').toDate();
    return this.model
      .find({
        status: { $in: ['pending', 'confirmed'] },
        bookingDate: { $gte: today },
      })
      .sort({ bookingDate: 1, 'timeSlot.startTime': 1 })
      .populate('timeSlot')
      .populate('mentorshipType')
      .populate({
        path: 'userId',
        select: 'profilePic name username',
      })
      .exec();
  }

  async getCompletedBookings(): Promise<IBooking[]> {
    return this.model
      .find({ status: 'completed' })
      .sort({ bookingDate: -1 })
      .populate('timeSlot')
      .populate({
        path: 'userId',
        select: 'profilePic name username',
      })
      .exec();
  }

  async getFilteredBookings(date?: Date, mentorshipTypeId?: string): Promise<IBooking[]> {
    const query: any = {};

    if (date) {
      const startOfDay = dayjs(date).startOf('day').toDate();
      const endOfDay = dayjs(date).endOf('day').toDate();
      query.bookingDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (mentorshipTypeId) {
      query.mentorshipType = mentorshipTypeId;
    }

    return this.model
      .find(query)
      .sort({ bookingDate: 1, 'timeSlot.startTime': 1 })
      .populate('timeSlot')
      .populate({
        path: 'userId',
        select: 'profilePic name username',
      })
      .exec();
  }
}
