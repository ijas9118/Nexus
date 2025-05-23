import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { CheckCircle, TrendingUp, UserPlus } from "lucide-react";
import { Squad } from "../SquadAdminDashboard";

interface ActiveSquadsTabProps {
  squads: Squad[];
  onInviteModerator: (squad: Squad) => void;
}

export default function ActiveSquadsTab({
  squads,
  onInviteModerator,
}: ActiveSquadsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Active Squads</CardTitle>
        <CardDescription>
          These squads have the highest engagement and content creation rates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squads.map((squad) => (
            <SquadCard
              key={squad.id}
              squad={squad}
              onInviteModerator={onInviteModerator}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SquadCardProps {
  squad: Squad;
  onInviteModerator: (squad: Squad) => void;
}

function SquadCard({ squad, onInviteModerator }: SquadCardProps) {
  return (
    <Card key={squad.id}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{squad.name}</CardTitle>
          <Avatar className="h-8 w-8">
            <AvatarImage src={squad.thumbnailUrl || "/placeholder.svg"} />
            <AvatarFallback>{squad.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Members</span>
            <span className="font-medium">
              {squad.membersCount.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Content</span>
            <span className="font-medium">
              {squad.contentCount.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Pending</span>
            <span className="font-medium">{squad.pendingCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Growth</span>
            <span className="font-medium text-emerald-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              12%
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {squad.description}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInviteModerator(squad)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Moderator
        </Button>
        <Button variant="default" size="sm">
          <CheckCircle className="h-4 w-4 mr-1" />
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
}
