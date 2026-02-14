import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { UserPlus } from "lucide-react";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";

export interface UserData {
  _id: string;
  name: string;
  profilePic: string;
  username: string;
  isFollowing?: boolean;
  isConnected?: boolean;
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
  onRemove?: (userId: string) => void;
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
  onRemove,
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
              <ConfirmDialog
                triggerLabel="Unfollow"
                triggerVariant="outline"
                title="Unfollow User?"
                description={`Are you sure you want to unfollow ${user.name}?`}
                confirmLabel="Unfollow"
                onConfirm={() => handleAction(() => onUnfollow?.(user._id))}
              />
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
            {user.isConnected ? (
              <Button variant="secondary" size="sm" disabled>
                Connected
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAction(() => onConnect?.(user._id))}
                disabled={isLoading}
              >
                Connect
              </Button>
            )}
          </>
        )}

        {type === "following" && (
          <ConfirmDialog
            triggerLabel="Unfollow"
            triggerVariant="outline"
            title="Unfollow User?"
            description={`Are you sure you want to unfollow ${user.name}?`}
            confirmLabel="Unfollow"
            onConfirm={() => handleAction(() => onUnfollow?.(user._id))}
          />
        )}

        {type === "connection" && (
          <ConfirmDialog
            triggerLabel="Remove"
            triggerVariant="destructive"
            title="Remove Connection?"
            description={`Are you sure you want to remove ${user.name} from your connections? You can reconnect anytime.`}
            confirmLabel="Remove"
            onConfirm={() => handleAction(() => onRemove?.(user._id))}
          />
        )}

        {type === "pending-outgoing" && (
          <ConfirmDialog
            triggerLabel="Withdraw"
            triggerVariant="outline"
            title="Withdraw Request?"
            description={`Are you sure you want to withdraw your connection request to ${user.name}?`}
            confirmLabel="Withdraw"
            onConfirm={() => handleAction(() => onWithdraw?.(user._id))}
          />
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
            <ConfirmDialog
              triggerLabel="Reject"
              triggerVariant="outline"
              title="Reject Request?"
              description={`Are you sure you want to reject the connection request from ${user.name}?`}
              confirmLabel="Reject"
              onConfirm={() => handleAction(() => onReject?.(user._id))}
            />
          </>
        )}
      </div>
    </div>
  );
}
