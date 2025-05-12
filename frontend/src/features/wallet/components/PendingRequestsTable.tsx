import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  StarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
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
import { Badge } from "@/components/atoms/badge";

interface PendingRequestsTableProps {
  requests: any[];
}

function PendingRequestsTable({ requests }: PendingRequestsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Withdrawal Requests</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Nexus Points</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No pending withdrawal requests
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id.toString()}>
                  <TableCell className="font-medium">
                    {request._id.toString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                      ${request.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-muted-foreground" />
                      {request.nexusPoints || 0}
                    </div>
                  </TableCell>
                  <TableCell>{request.withdrawalNote}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      <ClockIcon className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default PendingRequestsTable;
