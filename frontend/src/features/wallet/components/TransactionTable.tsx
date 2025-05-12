import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/molecules/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/table";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { TransactionDetails } from "@/types/wallet";

interface TransactionTableProps {
  transactions: TransactionDetails[];
}

function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    {transaction.transactionId || transaction._id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.type === "incoming" ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        <ArrowDownIcon className="mr-1 h-3 w-3" />
                        Incoming
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200"
                      >
                        <ArrowUpIcon className="mr-1 h-3 w-3" />
                        Outgoing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.type === "incoming" ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              transaction.details.profilePic ||
                              "/placeholder.svg"
                            }
                            alt={transaction.details.name || "User"}
                          />
                          <AvatarFallback>
                            {transaction.details.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {transaction.details.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {transaction.details.withdrawalNote || "No note"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "incoming"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "incoming" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.status === "completed" ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        <CheckCircleIcon className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    ) : transaction.status === "pending" ? (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <ClockIcon className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200"
                      >
                        <XCircleIcon className="mr-1 h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{transactions.length}</strong> transactions
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default TransactionTable;
