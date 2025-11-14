import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  inviteUserAsModerator,
  searchUsers,
  Squad,
  User,
} from "../SquadAdminDashboard";

interface InviteModeratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSquad: Squad | null;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function InviteModeratorDialog({
  open,
  onOpenChange,
  selectedSquad,
  selectedUser,
  setSelectedUser,
  searchQuery,
  setSearchQuery,
}: InviteModeratorDialogProps) {
  // Search users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length > 2 && open,
  });

  const handleInviteUser = async () => {
    if (selectedUser && selectedSquad) {
      try {
        await inviteUserAsModerator();
        toast.success(`Invitation sent to ${selectedUser.name}`, {
          description: `${selectedUser.name} has been invited as a moderator for ${selectedSquad.name}`,
        });
        onOpenChange(false);
        setSelectedUser(null);
      } catch {
        toast.error("Failed to send invitation");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Moderator</DialogTitle>
          <DialogDescription>
            {selectedSquad
              ? `Invite a user to become a moderator for ${selectedSquad.name}. Moderators can verify content and manage squad members.`
              : "Select a user to invite as a moderator."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Search for users</div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, username, or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            {isSearching ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching users...
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="divide-y">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer ${
                      selectedUser?.id === user.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profilePic || "/placeholder.svg"}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                    <div>
                      {user.isModerator && (
                        <Badge variant="outline" className="text-xs">
                          Already a Moderator
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.length > 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Type at least 3 characters to search
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInviteUser}
            disabled={!selectedUser || selectedUser.isModerator}
          >
            {selectedUser?.isModerator
              ? "Already a Moderator"
              : `Invite ${selectedUser ? selectedUser.name : "User"} as Moderator`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
