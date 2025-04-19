import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { CalendarClock, ExternalLink, Video } from "lucide-react";

interface UpcomingCallsProps {
  limit?: number;
}

const UpcomingCalls = ({ limit }: UpcomingCallsProps) => {
  const upcomingCalls = [
    {
      id: 1,
      mentee: {
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Today",
      time: "10:00 AM - 11:00 AM",
      type: "Code Review",
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: 2,
      mentee: {
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Tomorrow",
      time: "2:00 PM - 3:00 PM",
      type: "Career Advice",
      meetingLink: "https://meet.google.com/xyz-abcd-efg",
    },
    {
      id: 3,
      mentee: {
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 22, 2025",
      time: "4:00 PM - 5:00 PM",
      type: "Technical Guidance",
      meetingLink: null,
    },
    {
      id: 4,
      mentee: {
        name: "Diana Prince",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 25, 2025",
      time: "11:00 AM - 12:00 PM",
      type: "Interview Preparation",
      meetingLink: null,
    },
    {
      id: 5,
      mentee: {
        name: "Ethan Hunt",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 28, 2025",
      time: "3:00 PM - 4:00 PM",
      type: "Code Review",
      meetingLink: null,
    },
  ];

  const displayedCalls = limit ? upcomingCalls.slice(0, limit) : upcomingCalls;

  return (
    <div className="space-y-4">
      {displayedCalls.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <CalendarClock className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No upcoming calls</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any scheduled calls at the moment.
          </p>
        </div>
      ) : (
        displayedCalls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={call.mentee.avatar || "/placeholder.svg"}
                  alt={call.mentee.name}
                />
                <AvatarFallback>{call.mentee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{call.mentee.name}</div>
                <div className="text-sm text-muted-foreground">{call.type}</div>
                <div className="mt-1 flex items-center text-xs">
                  <CalendarClock className="mr-1 h-3 w-3" />
                  {call.date} • {call.time}
                </div>
              </div>
            </div>
            <div>
              {call.meetingLink ? (
                <Button size="sm" asChild>
                  <a
                    href={call.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              ) : (
                <Badge variant="outline">Upcoming</Badge>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingCalls;
