import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Calendar, Clock, Video } from "lucide-react";
import { format, parseISO } from "date-fns";
import { IBooking } from "@/types/booking";
import { isMeetingTimeReached } from "@/utils/meetingUtils";
import { useNavigate } from "react-router-dom";

export const MeetingCard = ({ booking }: { booking: IBooking }) => {
  const navigate = useNavigate();

  const [isJoinable, setIsJoinable] = useState(
    booking.status !== "completed" && isMeetingTimeReached(booking),
  );

  useEffect(() => {
    // If the meeting is already completed, no need to check
    if (booking.status === "completed") {
      setIsJoinable(false);
      return;
    }

    // Check if the meeting time is reached every 30 seconds
    const interval = setInterval(() => {
      const joinable = isMeetingTimeReached(booking);
      setIsJoinable(joinable);

      // Stop the interval if the meeting is joinable (no need to keep checking)
      if (joinable) {
        clearInterval(interval);
      }
    }, 30 * 1000); // Check every 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [booking]);

  const meetingTime = `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`;

  const handleJoinMeeting = () => {
    // If meetUrl is an absolute URL, we should convert it to a relative path for internal navigation
    const meetUrl = booking.meetUrl;
    if (!meetUrl) return;

    if (meetUrl.startsWith("http")) {
      try {
        const url = new URL(meetUrl);
        navigate(url.pathname + url.search);
      } catch (e) {
        console.error("Invalid URL:", meetUrl, e);
        navigate(meetUrl); // Fallback
      }
    } else {
      navigate(meetUrl);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage
              src={booking.mentorUserId.profilePic || "/placeholder.svg"}
              alt={booking.mentorUserId.name}
            />
            <AvatarFallback>
              {booking.mentorUserId.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-medium text-lg">
                  {booking.mentorUserId.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  @{booking.mentorUserId.username}
                </p>
              </div>
              <Badge variant="outline" className="w-fit">
                {booking.mentorshipType.name}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(
                    parseISO(booking.timeSlot.date),
                    "EEEE, MMMM d, yyyy",
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{meetingTime}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="gap-2 w-full sm:w-auto"
                disabled={!isJoinable}
                onClick={handleJoinMeeting}
              >
                <Video className="h-4 w-4" />
                Join Meeting
              </Button>
              {!isJoinable && booking.status !== "completed" && (
                <p className="text-xs text-muted-foreground mt-2">
                  You’ll be able to join the meeting 5 minutes before it begins.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
