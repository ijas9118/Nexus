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
import { ToggleLeft, ToggleRight, Users, Crown } from "lucide-react";
import type { Squad } from "@/types/squad";

interface SquadTableProps {
  squads: Squad[];
  onToggleStatus: (id: string) => Promise<void>;
}

export default function SquadTable({
  squads,
  onToggleStatus,
}: SquadTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Squad</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {squads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No squads found.
              </TableCell>
            </TableRow>
          ) : (
            squads.map((squad) => (
              <TableRow key={squad._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={squad.logo || "/placeholder.svg"}
                        alt={squad.name}
                      />
                      <AvatarFallback>
                        {squad.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{squad.name}</div>
                      <div className="text-sm text-muted-foreground">
                        @{squad.handle}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={squad.adminProfilePic || "/placeholder.svg"}
                        alt={squad.adminName}
                      />
                      <AvatarFallback>
                        {squad.adminName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{squad.adminName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{squad.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{squad.membersCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {squad.isPremium ? (
                      <>
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Premium
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline">Free</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={squad.isActive ? "default" : "secondary"}>
                    {squad.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onToggleStatus(squad._id)}
                  >
                    {squad.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle status</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
