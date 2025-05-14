import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Clock } from "lucide-react";
import { RecentBooking } from "@/types/mentorDashboard.types";
import dayjs from "dayjs";

interface BookingListProps {
  bookings: RecentBooking[];
}

export function BookingList({ bookings }: BookingListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking._id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={booking.userId.profilePic}
              alt={booking.userId.name}
            />
            <AvatarFallback>{booking.userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.userId.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {booking.mentorshipType.name}
            </p>
            <div className="flex items-center pt-1">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {dayjs(booking.bookingDate).format("MMMM D, YYYY")} at{" "}
                {booking.timeSlot.startTime}
              </span>
            </div>
          </div>
          <Badge
            variant={booking.status === "confirmed" ? "default" : "outline"}
          >
            {booking.status === "confirmed" ? "Confirmed" : "Pending"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
