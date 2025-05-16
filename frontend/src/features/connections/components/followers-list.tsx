import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle } from "lucide-react";
import UserCard from "./user-card";
import { EmptyState } from "./empty-state";
import FollowService from "@/services/followService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function FollowersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user?._id as string;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["followers", currentUserId],
    queryFn: () => FollowService.getFollowers(currentUserId),
  });

  const handleFollow = async (userId: string) => {
    // Implement follow functionality
    // After successful follow, refetch the data
    refetch();
  };

  const handleUnfollow = async (userId: string) => {
    // Implement unfollow functionality
    // After successful unfollow, refetch the data
    refetch();
  };

  const handleConnect = async (userId: string) => {
    // Implement connect functionality
    // After successful connect, refetch the data
    refetch();
  };

  const filteredFollowers =
    data?.filter(
      (follower: any) =>
        follower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.username.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load followers"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search followers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {isLoading ? (
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
      ) : filteredFollowers.length > 0 ? (
        <div className="space-y-4">
          {filteredFollowers.map((follower: any) => (
            <UserCard
              key={follower._id}
              user={follower}
              type="follower"
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onConnect={handleConnect}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No followers found"
          description={
            searchTerm
              ? "Try a different search term"
              : "When people follow you, they'll appear here"
          }
        />
      )}
    </div>
  );
}
