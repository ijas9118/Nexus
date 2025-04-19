import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import {
  CalendarClock,
  Clock,
  ExternalLink,
  MoreHorizontal,
  Video,
} from "lucide-react";
import { useState } from "react";
import RescheduleDialog from "./RescheduleDialog";

export const upcomingCalls = [
  {
    id: 1,
    mentee: {
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2025-04-20",
    time: "10:00 AM - 11:00 AM",
    type: "Code Review",
    status: "confirmed",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    mentee: {
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2025-04-21",
    time: "2:00 PM - 3:00 PM",
    type: "Career Advice",
    status: "confirmed",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
  },
  {
    id: 3,
    mentee: {
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2025-04-22",
    time: "4:00 PM - 5:00 PM",
    type: "Technical Guidance",
    status: "pending",
    meetingLink: null,
  },
];

const pastCalls = [
  {
    id: 4,
    mentee: {
      name: "Diana Prince",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2025-04-15",
    time: "11:00 AM - 12:00 PM",
    type: "Interview Preparation",
    status: "completed",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 5,
    mentee: {
      name: "Ethan Hunt",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2025-04-10",
    time: "3:00 PM - 4:00 PM",
    type: "Code Review",
    status: "completed",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
  },
];

const ScheduleCallCard = () => {
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);

  const handleReschedule = (call: any) => {
    setSelectedCall(call);
    setRescheduleDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Calls</CardTitle>
          <CardDescription>
            Manage your upcoming and past mentorship calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 pt-4">
              {upcomingCalls.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <CalendarClock className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No upcoming calls
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any scheduled calls at the moment.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  {upcomingCalls.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between border-b p-4 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={call.mentee.avatar || "/placeholder.svg"}
                            alt={call.mentee.name}
                          />
                          <AvatarFallback>
                            {call.mentee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{call.mentee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {call.type}
                          </div>
                          <div className="mt-1 flex items-center text-sm">
                            <CalendarClock className="mr-1 h-3 w-3" />
                            {call.date} • {call.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {call.status === "confirmed" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-800"
                          >
                            Pending
                          </Badge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {call.meetingLink && (
                              <DropdownMenuItem asChild>
                                <a
                                  href={call.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Video className="mr-2 h-4 w-4" />
                                  <span>Join Meeting</span>
                                  <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleReschedule(call)}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Reschedule</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <span>Cancel Call</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 pt-4">
              {pastCalls.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <CalendarClock className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No past calls</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any completed calls yet.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  {pastCalls.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between border-b p-4 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={call.mentee.avatar || "/placeholder.svg"}
                            alt={call.mentee.name}
                          />
                          <AvatarFallback>
                            {call.mentee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{call.mentee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {call.type}
                          </div>
                          <div className="mt-1 flex items-center text-sm">
                            <CalendarClock className="mr-1 h-3 w-3" />
                            {call.date} • {call.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Completed</Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <span>View Notes</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span>Schedule Follow-up</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <RescheduleDialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        selectedCall={selectedCall}
      />
    </>
  );
};

export default ScheduleCallCard;
