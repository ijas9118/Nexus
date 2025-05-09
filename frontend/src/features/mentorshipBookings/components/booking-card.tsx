import { useState } from "react";
import { format, parseISO } from "date-fns";
import type { IBooking, ITimeSlot } from "@/types/booking";
import { Card, CardContent } from "@/components/molecules/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Calendar, Clock, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { toast } from "sonner";
import { IUser } from "@/types/user";
import { RescheduleDialog } from "./reschedule-dialog";
import BookingService from "@/services/bookingService";

interface BookingCardProps {
  booking: IBooking;
  onActionComplete: () => void;
}

export function BookingCard({ booking, onActionComplete }: BookingCardProps) {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = booking.userId;
  const timeSlot = booking.timeSlot;

  const formattedDate = booking.bookingDate
    ? format(parseISO(booking.bookingDate), "MMMM d, yyyy")
    : "Date not available";

  const timeRange = timeSlot
    ? `${timeSlot.startTime} - ${timeSlot.endTime}`
    : "Time not available";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "completed":
        return "bg-sky-50 text-sky-700 border-sky-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "confirmed":
        return "bg-emerald-500";
      case "completed":
        return "bg-sky-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleJoinMeet = () => {
    if (booking.meetUrl) {
      window.open(booking.meetUrl, "_self");
    } else {
      toast.error("Meeting link is not available");
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      await BookingService.confirmBooking(booking._id);
      toast.success("Booking confirmed successfully");
      onActionComplete();
    } catch (error) {
      toast.error("Failed to confirm booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-muted shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Status indicator bar */}
        <div
          className={`h-1 w-full ${getStatusIndicatorColor(booking.status)}`}
        ></div>

        <div className="p-6 space-y-6">
          {/* Top section: User Info + Dropdown */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-muted">
                {user?.profilePic && (
                  <AvatarImage
                    src={user.profilePic || "/placeholder.svg"}
                    alt={user.name || "User"}
                  />
                )}
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {user?.name || "Unknown User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  @{user?.username || "username"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* Bottom: Status Badge */}
              <div className="flex justify-end">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(booking.status)} capitalize px-4 py-1 text-sm font-medium border`}
                >
                  {booking.status}
                </Badge>
              </div>

              {/* Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {booking.status !== "completed" && booking.meetUrl && (
                    <DropdownMenuItem onClick={handleJoinMeet}>
                      Join meeting
                    </DropdownMenuItem>
                  )}
                  {booking.status === "pending" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => setIsRescheduleOpen(true)}
                      >
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleConfirmBooking}>
                        Confirm
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-muted"></div>

          {/* Middle: Mentorship details in a grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Mentorship Type */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mentorship Type
              </h4>
              <p className="text-lg font-medium">
                {booking.mentorshipType.name}
              </p>
            </div>

            {/* Right column - Date and Time */}
            <div className="flex justify-around items-center">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{timeRange}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Reschedule Dialog */}
      <RescheduleDialog
        bookingId={booking._id}
        open={isRescheduleOpen}
        onOpenChange={setIsRescheduleOpen}
        onRescheduleComplete={onActionComplete}
      />
    </Card>
  );
}
