import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/table";
import { Textarea } from "@/components/atoms/textarea";
import { format } from "date-fns";
import { CheckIcon, MoreHorizontalIcon, XIcon } from "lucide-react";
import WalletService from "@/services/walletService";

export function WithdrawalRequestsTable() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"view" | "approve" | "reject">(
    "view",
  );
  const [adminNote, setAdminNote] = useState("");
  const queryClient = useQueryClient();

  // Fetch pending withdrawal requests using React Query
  const {
    data: withdrawalRequests = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["pendingRequests"],
    queryFn: WalletService.getPendingRequests,
  });

  console.log(withdrawalRequests);

  // Mutation for approving a withdrawal request
  const approveMutation = useMutation({
    mutationFn: (requestId: string) =>
      WalletService.approveWithdrawal(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      setSelectedRequest(null);
      setAdminNote("");
    },
    onError: () => {
      alert("Failed to approve withdrawal request.");
    },
  });

  // Mutation for rejecting a withdrawal request
  const rejectMutation = useMutation({
    mutationFn: (requestId: string) =>
      WalletService.rejectWithdrawal(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      setSelectedRequest(null);
      setAdminNote("");
    },
    onError: () => {
      alert("Failed to reject withdrawal request.");
    },
  });

  const handleAction = (
    request: any,
    action: "view" | "approve" | "reject",
  ) => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminNote("");
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    // Log admin note (optional: send to backend if required)
    console.log(
      `${actionType} request ${selectedRequest._id} with note: ${adminNote}`,
    );

    if (actionType === "approve") {
      approveMutation.mutate(selectedRequest._id.toString());
    } else if (actionType === "reject") {
      rejectMutation.mutate(selectedRequest._id.toString());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 hover:bg-amber-50"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-50"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-50"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) return <div>Loading withdrawal requests...</div>;
  if (error) return <div>Error loading withdrawal requests</div>;

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No pending withdrawal requests
                  </TableCell>
                </TableRow>
              ) : (
                withdrawalRequests.map((request) => (
                  <TableRow key={request._id.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              request.userId?.profilePic || "/placeholder.svg"
                            }
                            alt={request.userId?.name || "User"}
                          />
                          <AvatarFallback>
                            {request.userId?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.userId?.role || "User"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.nexusPoints ? (
                        <span className="text-purple-600">Nexus Points</span>
                      ) : (
                        <span className="text-green-600">Money</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.amount ? (
                        <span>₹{request.amount.toLocaleString()}</span>
                      ) : (
                        <span>
                          {request.nexusPoints} NP (₹
                          {(request.nexusPoints! * 0.5).toLocaleString()})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction(request, "view")}
                          >
                            View Details
                          </DropdownMenuItem>
                          {request.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleAction(request, "approve")}
                              >
                                Approve Request
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(request, "reject")}
                              >
                                Reject Request
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedRequest && (
        <Dialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === "view"
                  ? "Withdrawal Request Details"
                  : actionType === "approve"
                    ? "Approve Withdrawal Request"
                    : "Reject Withdrawal Request"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "view"
                  ? "View the details of this withdrawal request."
                  : actionType === "approve"
                    ? "Are you sure you want to approve this request?"
                    : "Are you sure you want to reject this request?"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      selectedRequest.userId?.profilePic || "/placeholder.svg"
                    }
                    alt={selectedRequest.userId?.name || "User"}
                  />
                  <AvatarFallback>
                    {selectedRequest.userId?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedRequest.userId?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRequest.userId?.type || "User"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Request Type:</div>
                <div>
                  {selectedRequest.nexusPoints ? "Nexus Points" : "Money"}
                </div>

                <div className="font-medium">Amount:</div>
                <div>
                  {selectedRequest.amount
                    ? `₹${selectedRequest.amount.toLocaleString()}`
                    : `${selectedRequest.nexusPoints} NP (₹${(selectedRequest.nexusPoints! * 0.5).toLocaleString()})`}
                </div>

                <div className="font-medium">Status:</div>
                <div>{getStatusBadge(selectedRequest.status)}</div>

                <div className="font-medium">Date:</div>
                <div>
                  {format(new Date(selectedRequest.createdAt), "MMM dd, yyyy")}
                </div>

                <div className="font-medium">User Note:</div>
                <div className="col-span-2 rounded-md bg-muted p-2">
                  {selectedRequest.withdrawalNote}
                </div>
              </div>

              {actionType !== "view" && (
                <div className="space-y-2">
                  <label htmlFor="admin-note" className="text-sm font-medium">
                    Admin Note:
                  </label>
                  <Textarea
                    id="admin-note"
                    placeholder={`Add a note about why you're ${actionType === "approve" ? "approving" : "rejecting"} this request...`}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </Button>

              {actionType !== "view" && (
                <Button
                  onClick={handleConfirmAction}
                  variant={actionType === "approve" ? "default" : "destructive"}
                  disabled={
                    approveMutation.isPending || rejectMutation.isPending
                  }
                >
                  {actionType === "approve" ? (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" /> Approve
                    </>
                  ) : (
                    <>
                      <XIcon className="mr-2 h-4 w-4" /> Reject
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
