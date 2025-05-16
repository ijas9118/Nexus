import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import FollowService from "@/services/followService";
import { Button } from "@/components/atoms/button";

interface StatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  statType: "followers" | "following" | "connections";
  userId: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  profilePic?: string;
}

export default function StatDialog({
  isOpen,
  onClose,
  statType,
  userId,
}: StatDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        let response;
        switch (statType) {
          case "followers":
            response = await FollowService.getFollowers(userId);
            console.log(response);
            break;
          case "following":
            response = await FollowService.getFollowings(userId);

            break;
          case "connections":
            response = await FollowService.getConnections(userId);
            break;
        }
        setUsers(response || []);
      } catch (error) {
        console.error(`Error fetching ${statType}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, statType, userId]);

  const getTitle = () => {
    switch (statType) {
      case "followers":
        return "Followers";
      case "following":
        return "Following";
      case "connections":
        return "Connections";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No {statType} found.
            </p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          user.profilePic ||
                          "https://randomuser.me/api/portraits/men/4.jpg"
                        }
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  {statType === "following" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log(user._id)}
                    >
                      Unfollow
                    </Button>
                  )}
                  {statType === "followers" && (
                    <Button
                      variant="outline"
                      size="sm"
                      //   onClick={() => handleFollow(user._id)}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
