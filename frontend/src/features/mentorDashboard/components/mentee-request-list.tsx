import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { CalendarClock, Check, Clock, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";

interface MenteeRequestListProps {
  filter?: string;
  search?: string;
  sortBy?: string;
  limit?: number;
}

const MenteeRequestList = ({
  filter = "all",
  search = "",
  sortBy = "newest",
  limit,
}: MenteeRequestListProps) => {
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const menteeRequests = [
    {
      id: 1,
      mentee: {
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "alice.johnson@example.com",
        location: "San Francisco, CA",
      },
      date: "Apr 18, 2025",
      type: "Code Review",
      status: "pending",
      message:
        "I need help with optimizing my React application. It's currently experiencing performance issues with large datasets.",
      preferredTime: "Weekdays evenings",
    },
    {
      id: 2,
      mentee: {
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "bob.smith@example.com",
        location: "New York, NY",
      },
      date: "Apr 17, 2025",
      type: "Career Advice",
      status: "pending",
      message:
        "I'm considering a transition from frontend to full-stack development and would appreciate your guidance on the best approach.",
      preferredTime: "Weekends",
    },
    {
      id: 3,
      mentee: {
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "charlie.brown@example.com",
        location: "Chicago, IL",
      },
      date: "Apr 15, 2025",
      type: "Technical Guidance",
      status: "approved",
      message:
        "I need help understanding microservices architecture and how to implement it in my current project.",
      preferredTime: "Weekday mornings",
    },
    {
      id: 4,
      mentee: {
        name: "Diana Prince",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "diana.prince@example.com",
        location: "Seattle, WA",
      },
      date: "Apr 10, 2025",
      type: "Interview Preparation",
      status: "completed",
      message:
        "I have an interview with a major tech company next week and would like to practice system design questions.",
      preferredTime: "Flexible",
    },
    {
      id: 5,
      mentee: {
        name: "Ethan Hunt",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "ethan.hunt@example.com",
        location: "Austin, TX",
      },
      date: "Apr 5, 2025",
      type: "Code Review",
      status: "rejected",
      message:
        "I've built a new authentication system and would like you to review it for security vulnerabilities.",
      preferredTime: "Weekends only",
    },
    {
      id: 6,
      mentee: {
        name: "Fiona Gallagher",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "fiona.gallagher@example.com",
        location: "Boston, MA",
      },
      date: "Apr 3, 2025",
      type: "Career Advice",
      status: "pending",
      message:
        "I'm trying to decide between pursuing a management track or staying technical. Would love your perspective.",
      preferredTime: "Weekday evenings",
    },
    {
      id: 7,
      mentee: {
        name: "George Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "george.miller@example.com",
        location: "Denver, CO",
      },
      date: "Apr 1, 2025",
      type: "Technical Guidance",
      status: "pending",
      message:
        "I need help understanding GraphQL and how to integrate it with my Node.js backend.",
      preferredTime: "Anytime on weekends",
    },
  ];

  let filteredRequests = menteeRequests.filter((request) => {
    if (filter !== "all" && request.status !== filter) return false;
    if (
      search &&
      !request.mentee.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  if (sortBy === "newest") {
    filteredRequests = [...filteredRequests].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } else if (sortBy === "oldest") {
    filteredRequests = [...filteredRequests].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } else if (sortBy === "nameAsc") {
    filteredRequests = [...filteredRequests].sort((a, b) =>
      a.mentee.name.localeCompare(b.mentee.name),
    );
  } else if (sortBy === "nameDesc") {
    filteredRequests = [...filteredRequests].sort((a, b) =>
      b.mentee.name.localeCompare(a.mentee.name),
    );
  }

  if (limit) {
    filteredRequests = filteredRequests.slice(0, limit);
  }

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setViewDetailsDialogOpen(true);
  };

  const handleReject = (request: any) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  return (
    <>
      {filteredRequests.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <Clock className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No mentee requests</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any mentee requests matching your filters.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b p-4 last:border-0"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={request.mentee.avatar || "/placeholder.svg"}
                    alt={request.mentee.name}
                  />
                  <AvatarFallback>
                    {request.mentee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{request.mentee.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.type}
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <CalendarClock className="mr-1 h-3 w-3" />
                    {request.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {request.status === "pending" ? (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-800"
                  >
                    Pending
                  </Badge>
                ) : request.status === "approved" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                    Approved
                  </Badge>
                ) : request.status === "completed" ? (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-800 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-800 hover:bg-red-50 hover:text-red-800"
                  >
                    Rejected
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(request)}
                    >
                      View Details
                    </DropdownMenuItem>
                    {request.status === "pending" && (
                      <>
                        <DropdownMenuItem>
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          <span>Approve Request</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(request)}>
                          <X className="mr-2 h-4 w-4 text-red-600" />
                          <span>Reject Request</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <>
          <Dialog
            open={viewDetailsDialogOpen}
            onOpenChange={setViewDetailsDialogOpen}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Mentorship Request Details</DialogTitle>
                <DialogDescription>
                  Request from {selectedRequest.mentee.name} for{" "}
                  {selectedRequest.type}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedRequest.mentee.avatar || "/placeholder.svg"}
                      alt={selectedRequest.mentee.name}
                    />
                    <AvatarFallback>
                      {selectedRequest.mentee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <h4 className="font-medium">
                      {selectedRequest.mentee.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.mentee.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.mentee.location}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-medium">Request Details</h4>
                  <div className="rounded-md border p-3 text-sm">
                    {selectedRequest.message}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Mentorship Type</h4>
                    <p className="text-sm">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Preferred Time</h4>
                    <p className="text-sm">{selectedRequest.preferredTime}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Status</h4>
                  <div className="mt-1">
                    {selectedRequest.status === "pending" ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-800"
                      >
                        Pending
                      </Badge>
                    ) : selectedRequest.status === "approved" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                        Approved
                      </Badge>
                    ) : selectedRequest.status === "completed" ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-800 hover:bg-blue-50 hover:text-blue-800"
                      >
                        Completed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-800 hover:bg-red-50 hover:text-red-800"
                      >
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedRequest)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedRequest.status !== "pending" && (
                  <Button onClick={() => setViewDetailsDialogOpen(false)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Mentorship Request</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this request from{" "}
                  {selectedRequest.mentee.name}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Textarea
                  placeholder="Reason for rejection (optional)"
                  className="min-h-[100px]"
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectDialogOpen(false)}
                >
                  Confirm Rejection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default MenteeRequestList;
