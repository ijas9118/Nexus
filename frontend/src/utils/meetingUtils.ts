import { isAfter } from "date-fns";
import { IBooking } from "@/types/booking";

export const isMeetingTimeReached = (booking: IBooking) => {
  const meetingDate = new Date(booking.timeSlot.date);
  const [startHour, startMinute, startPeriod] =
    booking.timeSlot.startTime.match(/(\d+):(\d+)\s(AM|PM)/)?.slice(1) || [];

  if (!startHour || !startMinute || !startPeriod) return false;

  let hour = Number.parseInt(startHour);
  if (startPeriod === "PM" && hour !== 12) hour += 12;
  if (startPeriod === "AM" && hour === 12) hour = 0;

  const meetingStartTime = new Date(meetingDate);
  meetingStartTime.setHours(hour, Number.parseInt(startMinute), 0);

  // Enable button 5 minutes before meeting starts
  const fiveMinutesBefore = new Date(meetingStartTime);
  fiveMinutesBefore.setMinutes(meetingStartTime.getMinutes() - 5);

  return isAfter(new Date(), fiveMinutesBefore);
};
