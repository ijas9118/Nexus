import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Alert, AlertDescription } from "@/components/atoms/alert";
import { Input } from "@/components/atoms/input";
import FollowService from "@/services/followService";
import type { RootState } from "@/store/store";
import type { UserInterface } from "@/types/user";

import { EmptyState } from "./empty-state";
import UserCard from "./user-card";

export default function FollowersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user?._id as string;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["followers", currentUserId],
    queryFn: () => FollowService.getFollowers(currentUserId),
  });

  const handleFollow = async (userId: string) => {
    try {
      await FollowService.followUser(userId);
      refetch();
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await FollowService.unfollowUser(userId);
      refetch();
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await FollowService.sendConnectionRequest(userId);
      refetch();
    } catch (error) {
      console.error("Failed to send connection request:", error);
    }
  };

  const filteredFollowers =
    data?.filter(
      (follower: UserInterface) =>
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
          {filteredFollowers.map((follower: UserInterface) => (
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
