import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/organisms/tabs";
import {
  Check,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

const MentorPayments = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all-time");

  const payments = [
    {
      id: "INV-001",
      mentee: {
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 18, 2025",
      amount: 75.0,
      status: "completed",
      type: "Code Review",
      sessions: 1,
    },
    {
      id: "INV-002",
      mentee: {
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 15, 2025",
      amount: 150.0,
      status: "completed",
      type: "Career Advice",
      sessions: 2,
    },
    {
      id: "INV-003",
      mentee: {
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 10, 2025",
      amount: 75.0,
      status: "pending",
      type: "Technical Guidance",
      sessions: 1,
    },
    {
      id: "INV-004",
      mentee: {
        name: "Diana Prince",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Apr 5, 2025",
      amount: 225.0,
      status: "completed",
      type: "Interview Preparation",
      sessions: 3,
    },
    {
      id: "INV-005",
      mentee: {
        name: "Ethan Hunt",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Mar 28, 2025",
      amount: 75.0,
      status: "failed",
      type: "Code Review",
      sessions: 1,
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    if (filter !== "all" && payment.status !== filter) return false;
    if (
      search &&
      !payment.mentee.name.toLowerCase().includes(search.toLowerCase()) &&
      !payment.id.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and manage all your mentorship payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Tabs defaultValue="all" onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <div className="grid gap-1.5">
                <Label htmlFor="date-range" className="sr-only">
                  Date Range
                </Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range" className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="search-payments" className="sr-only">
                  Search
                </Label>
                <Input
                  id="search-payments"
                  placeholder="Search payments..."
                  className="w-[180px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-5">Mentee</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center p-8 text-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No payments found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No payments match your current filters.
                  </p>
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="grid grid-cols-12 items-center border-b p-3 text-sm last:border-0"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={payment.mentee.avatar || "/placeholder.svg"}
                          alt={payment.mentee.name}
                        />
                        <AvatarFallback>
                          {payment.mentee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{payment.mentee.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {payment.type} • {payment.sessions}{" "}
                          {payment.sessions === 1 ? "session" : "sessions"}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 font-medium">
                      ${payment.amount.toFixed(2)}
                    </div>
                    <div className="col-span-2 text-muted-foreground">
                      {payment.date}
                    </div>
                    <div className="col-span-2">
                      {payment.status === "completed" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                          <Check className="mr-1 h-3 w-3" /> Paid
                        </Badge>
                      ) : payment.status === "pending" ? (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-800"
                        >
                          Pending
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-800 hover:bg-red-50 hover:text-red-800"
                        >
                          Failed
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Invoice</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Receipt</span>
                          </DropdownMenuItem>
                          {payment.status === "pending" && (
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              <span>Send Reminder</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorPayments;
