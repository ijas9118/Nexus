import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/table";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { CheckCircle, Clock, UserPlus } from "lucide-react";
import { Squad } from "../SquadAdminDashboard";

interface AllSquadsTabProps {
  squads: Squad[];
  onInviteModerator: (squad: Squad) => void;
}

export default function AllSquadsTab({
  squads,
  onInviteModerator,
}: AllSquadsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Squads</CardTitle>
        <CardDescription>
          View and manage all squads. Click on a squad to see detailed
          statistics and options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Squad</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Moderators</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {squads.map((squad) => (
              <TableRow key={squad.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={squad.thumbnailUrl || "/placeholder.svg"}
                      />
                      <AvatarFallback>{squad.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{squad.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                        {squad.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{squad.membersCount.toLocaleString()}</TableCell>
                <TableCell>{squad.contentCount.toLocaleString()}</TableCell>
                <TableCell>
                  {squad.pendingCount > 0 ? (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 w-fit"
                    >
                      <Clock className="h-3 w-3" />
                      {squad.pendingCount}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell>{squad.moderatorsCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInviteModerator(squad)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Add Moderator</span>
                    </Button>
                    <Button variant="default" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Verify Content</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
