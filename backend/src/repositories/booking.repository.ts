import dayjs from "dayjs";
import { injectable } from "inversify";

import type { IBookingRepository } from "@/core/interfaces/repositories/i-booking-repository";
import type { RecentBooking } from "@/core/types/mentor-dashboard";
import type { IBooking } from "@/models/booking.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { BookingModel } from "@/models/booking.model";

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(BookingModel);
  }

  async createBooking(data: Partial<IBooking>): Promise<IBooking> {
    return this.create(data);
  }

  async getUpcomingBookings(): Promise<IBooking[]> {
    const today = dayjs().startOf("day").toDate();
    return this.model
      .find({
        status: { $in: ["pending", "confirmed"] },
        bookingDate: { $gte: today },
      })
      .sort({ "bookingDate": 1, "timeSlot.startTime": 1 })
      .populate("timeSlot")
      .populate("mentorshipType")
      .populate({
        path: "userId",
        select: "profilePic name username",
      })
      .populate({
        path: "mentorUserId",
        select: "profilePic name username",
      })
      .exec();
  }

  async getCompletedBookings(): Promise<IBooking[]> {
    return this.model
      .find({ status: "completed" })
      .sort({ bookingDate: -1 })
      .populate("timeSlot")
      .populate({
        path: "userId",
        select: "profilePic name username",
      })
      .populate({
        path: "mentorId",
        select: "profilePic name username",
      })
      .exec();
  }

  async getFilteredBookings(date?: Date, mentorshipTypeId?: string): Promise<IBooking[]> {
    const query: any = {};

    if (date) {
      const startOfDay = dayjs(date).startOf("day").toDate();
      const endOfDay = dayjs(date).endOf("day").toDate();
      query.bookingDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (mentorshipTypeId) {
      query.mentorshipType = mentorshipTypeId;
    }

    return this.model
      .find(query)
      .sort({ "bookingDate": 1, "timeSlot.startTime": 1 })
      .populate("timeSlot")
      .populate({
        path: "userId",
        select: "profilePic name username",
      })
      .exec();
  }

  async getRecentBookings(userId: string): Promise<RecentBooking[]> {
    const bookings = await this.model
      .find({ mentorUserId: userId, status: { $ne: "unpaid" } })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("bookingDate mentorshipType status timeSlot userId")
      .populate("userId", "name profilePic")
      .populate("timeSlot", "startTime")
      .populate("mentorshipType", "name");

    return bookings as unknown as RecentBooking[];
  }
}
