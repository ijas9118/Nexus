import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import UserCard from "./user-card";
import FollowService from "@/services/followService";
import { EmptyState } from "./empty-state";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ConnectionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user?._id as string;

  const {
    data: connections,
    isLoading: isLoadingConnections,
    isError: isErrorConnections,
    error: errorConnections,
    refetch: refetchConnections,
  } = useQuery({
    queryKey: ["connections", currentUserId],
    queryFn: () => FollowService.getConnections(currentUserId),
  });

  const { data: pendingOutgoing, isLoading: isLoadingOutgoing } = useQuery({
    queryKey: ["pending-outgoing", currentUserId],
    queryFn: () => FollowService.getSentConnectionRequests(),
  });

  const { data: pendingIncoming, isLoading: isLoadingIncoming } = useQuery({
    queryKey: ["pending-incoming", currentUserId],
    queryFn: () => FollowService.getPendingRequests(),
  });

  const handleAccept = async (userId: string) => {
    try {
      await FollowService.acceptConnectionRequest(userId);
      refetchConnections();
    } catch (error) {
      console.error("Failed to accept connection:", error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await FollowService.withdrawConnectionRequest(userId);
      refetchConnections();
    } catch (error) {
      console.error("Failed to reject connection:", error);
    }
  };

  const filterUsers = (users: any[] = []) => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const filteredConnections = filterUsers(connections);
  const filteredPendingOutgoing = filterUsers(pendingOutgoing);
  const filteredPendingIncoming = filterUsers(pendingIncoming);

  if (isErrorConnections) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errorConnections instanceof Error
            ? errorConnections.message
            : "Failed to load connections"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search connections..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="established">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="established">Connected</TabsTrigger>
          <TabsTrigger value="outgoing">Sent Requests</TabsTrigger>
          <TabsTrigger value="incoming">Received Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="established" className="mt-0">
          {isLoadingConnections ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-[76px] rounded-lg bg-muted animate-pulse"
                  />
                ))}
            </div>
          ) : filteredConnections.length > 0 ? (
            <div className="space-y-4">
              {filteredConnections.map((connection) => (
                <UserCard
                  key={connection._id}
                  user={connection}
                  type="connection"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No connections yet"
              description={
                searchTerm
                  ? "Try a different search term"
                  : "When you connect with people, they'll appear here"
              }
            />
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-0">
          {isLoadingOutgoing ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-[76px] rounded-lg bg-muted animate-pulse"
                  />
                ))}
            </div>
          ) : filteredPendingOutgoing.length > 0 ? (
            <div className="space-y-4">
              {filteredPendingOutgoing.map((user) => (
                <UserCard key={user._id} user={user} type="pending-outgoing" />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No pending requests"
              description={
                searchTerm
                  ? "Try a different search term"
                  : "You haven't sent any connection requests"
              }
            />
          )}
        </TabsContent>

        <TabsContent value="incoming" className="mt-0">
          {isLoadingIncoming ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-[76px] rounded-lg bg-muted animate-pulse"
                  />
                ))}
            </div>
          ) : filteredPendingIncoming.length > 0 ? (
            <div className="space-y-4">
              {filteredPendingIncoming.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  type="pending-incoming"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No incoming requests"
              description={
                searchTerm
                  ? "Try a different search term"
                  : "You don't have any pending connection requests"
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
