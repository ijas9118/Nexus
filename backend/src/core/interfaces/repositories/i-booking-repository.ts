import type { BaseRepository } from "@/core/abstracts/base.repository";
import type { RecentBooking } from "@/core/types/mentor-dashboard";
import type { IBooking } from "@/models/booking/booking.model";

export interface IBookingRepository extends BaseRepository<IBooking> {
  createBooking: (data: Partial<IBooking>) => Promise<IBooking>;
  findById: (id: string) => Promise<IBooking | null>;
  getUpcomingBookings: () => Promise<IBooking[]>;
  getCompletedBookings: () => Promise<IBooking[]>;
  getFilteredBookings: (date?: Date, mentorshipTypeId?: string) => Promise<IBooking[]>;
  getRecentBookings: (userId: string) => Promise<RecentBooking[]>;
}
