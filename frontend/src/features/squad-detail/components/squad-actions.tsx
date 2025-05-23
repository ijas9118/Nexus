import { useState } from "react";
import { useDispatch } from "react-redux";
import { PlusCircle, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { InvitationShareMenu } from "./invitation-share-menu";
import { Link } from "react-router-dom";
import SquadService from "@/services/user/squadService";
import { SquadDetail } from "@/types/squad";
import { addUserSquad, removeUserSquad } from "@/store/slices/userSquadsSlice";

interface SquadActionsProps {
  squad: SquadDetail;
  isAdmin: boolean;
  isJoined: boolean;
}

export function SquadActions({
  squad,
  isAdmin,
  isJoined: initialJoined,
}: SquadActionsProps) {
  const [inviteLink] = useState(
    `https://nexus-connect.ddns.net/squads/${squad.handle}`,
  );
  const [isJoined, setIsJoined] = useState(initialJoined);
  const { showConfirm } = useConfirmDialog();
  const dispatch = useDispatch();

  const handleJoin = async () => {
    try {
      await SquadService.joinSquad(squad._id);
      dispatch(addUserSquad(squad));
      setIsJoined(true);
    } catch (err) {
      console.error("Failed to join squad:", err);
    }
  };

  const handleLeave = () => {
    showConfirm({
      title: "Are you sure?",
      description: `You are about to leave the ${squad.name} squad. You will no longer have access to exclusive content.`,
      confirmLabel: "Leave Squad",
      cancelLabel: "Cancel",
      onConfirm: async () => {
        try {
          await SquadService.leaveSquad(squad._id);
          dispatch(removeUserSquad(squad._id));
          setIsJoined(false);
        } catch (err) {
          console.error("Failed to leave squad:", err);
        }
      },
    });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Members</h3>
          <p className="text-sm text-muted-foreground">
            {squad.membersCount} members
          </p>
        </div>
        <InvitationShareMenu inviteLink={inviteLink} squadName={squad.name} />
      </div>

      <Separator />

      <div className="space-y-3">
        <Link to="/addPost">
          <Button className="w-full" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Post
          </Button>
        </Link>

        {!isAdmin &&
          (isJoined ? (
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={handleLeave}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave Squad
            </Button>
          ) : (
            <Button className="w-full" size="sm" onClick={handleJoin}>
              <UserPlus className="mr-2 h-4 w-4" />
              Join Squad
            </Button>
          ))}
      </div>
    </div>
  );
}
