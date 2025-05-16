import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "./empty-state";
import FollowService from "@/services/followService";
import UserCard from "./user-card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function FollowingList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user?._id as string;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["following", currentUserId],
    queryFn: () => FollowService.getFollowings(currentUserId),
  });

  const handleUnfollow = async (userId: string) => {
    // Implement unfollow functionality
    // After successful unfollow, refetch the data
    console.log(userId);
    refetch();
  };

  const filteredFollowing =
    data?.filter(
      (following: any) =>
        following.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        following.username.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load following users"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search following..."
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
      ) : filteredFollowing.length > 0 ? (
        <div className="space-y-4">
          {filteredFollowing.map((following: any) => (
            <UserCard
              key={following._id}
              user={following}
              type="following"
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="You're not following anyone"
          description={
            searchTerm
              ? "Try a different search term"
              : "When you follow people, they'll appear here"
          }
        />
      )}
    </div>
  );
}
