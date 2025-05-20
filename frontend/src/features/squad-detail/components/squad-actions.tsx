import { useState } from "react";
import { PlusCircle, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { toast } from "sonner";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";

interface SquadActionsProps {
  squadName: string;
  membersCount: number;
  isAdmin: boolean;
}

export function SquadActions({
  membersCount,
  squadName,
  isAdmin,
}: SquadActionsProps) {
  const [inviteLink] = useState("https://squad.io/invite/nodejs-dev");
  const { showConfirm } = useConfirmDialog();

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast("Invite link copied", {
      description: "The invite link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Members</h3>
          <p className="text-sm text-muted-foreground">
            {membersCount.toLocaleString()} members
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copyInviteLink}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite
        </Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <Button className="w-full" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Post
        </Button>
        {!isAdmin && (
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={() =>
              showConfirm({
                title: "Are you sure?",
                description: `You are about to leave the ${squadName} squad. You will no
            longer have access to exclusive content.`,
                confirmLabel: "Leave Squad",
                cancelLabel: "Cancel",
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4" />
            Leave Squad
          </Button>
        )}
      </div>
    </div>
  );
}
