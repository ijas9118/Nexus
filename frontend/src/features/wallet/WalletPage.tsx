import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Textarea } from "@/components/atoms/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";

// Mock data for demonstration
const transactions = [
  {
    id: "TX123456",
    type: "incoming",
    bookingId: "BK78901",
    date: "2023-05-01",
    amount: 150.0,
    status: "completed",
    user: {
      name: "John Smith",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "TX123457",
    type: "incoming",
    bookingId: "BK78902",
    date: "2023-05-03",
    amount: 200.0,
    status: "completed",
    user: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "TX123458",
    type: "outgoing",
    date: "2023-05-05",
    amount: 300.0,
    status: "completed",
    reference: "May withdrawal",
  },
  {
    id: "TX123459",
    type: "incoming",
    bookingId: "BK78903",
    date: "2023-05-08",
    amount: 175.0,
    status: "completed",
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "TX123460",
    type: "outgoing",
    date: "2023-05-15",
    amount: 200.0,
    status: "pending",
    reference: "Mid-month withdrawal",
  },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate wallet balance
  const walletBalance = transactions.reduce((total, transaction) => {
    if (transaction.type === "incoming") {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 0);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });

  const handleWithdrawalRequest = () => {
    // Here you would implement the actual API call to request a withdrawal
    alert(
      `Withdrawal request for $${withdrawalAmount} has been submitted to admin.`,
    );
    setWithdrawalAmount("");
    setWithdrawalReason("");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Mentor Wallet</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <ArrowUpIcon className="mr-2 h-4 w-4" />
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
              <DialogDescription>
                Submit a request to withdraw funds from your wallet. The admin
                will review your request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3 relative">
                  <DollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly explain the reason for withdrawal"
                  className="col-span-3"
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleWithdrawalRequest}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${walletBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated as of {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incoming (This Month)
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">
              $
              {transactions
                .filter((t) => t.type === "incoming")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {transactions.filter((t) => t.type === "incoming").length}{" "}
              bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outgoing (This Month)
            </CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">
              $
              {transactions
                .filter((t) => t.type === "outgoing")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {transactions.filter((t) => t.type === "outgoing").length}{" "}
              withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <TransactionTable transactions={filteredTransactions} />
        </TabsContent>

        <TabsContent value="incoming" className="mt-6">
          <TransactionTable transactions={filteredTransactions} />
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          <TransactionTable transactions={filteredTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransactionTable({ transactions }) {
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
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
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
                            src={transaction.user.avatar || "/placeholder.svg"}
                            alt={transaction.user.name}
                          />
                          <AvatarFallback>
                            {transaction.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {transaction.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Booking: {transaction.bookingId}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">{transaction.reference}</div>
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
