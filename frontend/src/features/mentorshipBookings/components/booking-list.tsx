import type { IBooking } from "@/types/booking";
import { BookingCard } from "./booking-card";
import { Skeleton } from "@/components/atoms/skeleton";

interface BookingListProps {
  bookings: IBooking[];
  isLoading: boolean;
  type: "upcoming" | "past";
  onActionComplete: () => void;
}

export function BookingList({
  bookings,
  isLoading,
  type,
  onActionComplete,
}: BookingListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[180px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          {type === "upcoming"
            ? "No upcoming bookings found"
            : "No past bookings found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onActionComplete={onActionComplete}
        />
      ))}
    </div>
  );
}
