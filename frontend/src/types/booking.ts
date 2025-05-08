import { MentorshipType } from "./mentor";
import { IUser } from "./user";

export interface IBooking {
  _id: string;
  userId: IUser;
  mentorId: string;
  mentorshipType: MentorshipType;
  timeSlot: ITimeSlot; // Populated TimeSlot or ID
  bookingDate: string; // ISO string, e.g., "2025-05-10T00:00:00.000Z"
  reason: string;
  status: "pending" | "confirmed" | "completed";
  meetUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITimeSlot {
  _id: string;
  mentorId: string;
  date: string; // ISO string
  startTime: string; // e.g., "10:00 AM"
  endTime: string; // e.g., "11:00 AM"
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}
