import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { UserPlus, UserCheck, UserX, User } from "lucide-react";

export interface UserData {
  _id: string;
  name: string;
  profilePic: string;
  username: string;
  isFollowing?: boolean;
}

interface UserCardProps {
  user: UserData;
  type:
    | "follower"
    | "following"
    | "connection"
    | "pending-outgoing"
    | "pending-incoming";
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onConnect?: (userId: string) => void;
  onAccept?: (userId: string) => void;
  onReject?: (userId: string) => void;
  onWithdraw?: (userId: string) => void;
}

export default function UserCard({
  user,
  type,
  onFollow,
  onUnfollow,
  onConnect,
  onAccept,
  onReject,
  onWithdraw,
}: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      action();
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.profilePic || "/placeholder.svg"}
            alt={user.name}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {type === "follower" && (
          <>
            {user.isFollowing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(() => onUnfollow?.(user._id))}
                disabled={isLoading}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Following
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(() => onFollow?.(user._id))}
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Follow Back
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction(() => onConnect?.(user._id))}
              disabled={isLoading}
            >
              Connect
            </Button>
          </>
        )}

        {type === "following" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(() => onUnfollow?.(user._id))}
            disabled={isLoading}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Following
          </Button>
        )}

        {type === "connection" && (
          <Button variant="default" size="sm" disabled>
            <User className="mr-2 h-4 w-4" />
            Connected
          </Button>
        )}

        {type === "pending-outgoing" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(() => onWithdraw?.(user._id))}
            disabled={isLoading}
          >
            <UserX className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        )}

        {type === "pending-incoming" && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction(() => onAccept?.(user._id))}
              disabled={isLoading}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(() => onReject?.(user._id))}
              disabled={isLoading}
            >
              <UserX className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
