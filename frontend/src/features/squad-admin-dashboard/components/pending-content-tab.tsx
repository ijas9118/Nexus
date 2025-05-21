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
import { CheckCircle, Clock } from "lucide-react";
import { Squad } from "../SquadAdminDashboard";

interface PendingContentTabProps {
  squads: Squad[];
}

export default function PendingContentTab({ squads }: PendingContentTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Squads with Pending Content</CardTitle>
        <CardDescription>
          These squads have content waiting for your verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Squad</TableHead>
              <TableHead>Pending Items</TableHead>
              <TableHead>Oldest Item</TableHead>
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
                    <div>{squad.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Clock className="h-3 w-3" />
                    {squad.pendingCount}
                  </Badge>
                </TableCell>
                <TableCell>2 days ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="default" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verify Now
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
