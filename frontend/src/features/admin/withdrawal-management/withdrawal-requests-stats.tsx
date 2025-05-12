import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  ArrowUpIcon,
  CheckCircle2Icon,
  Clock3Icon,
  XCircleIcon,
} from "lucide-react";

export function WithdrawalRequestsStats() {
  // In a real application, these would be fetched from your API
  const stats = {
    pending: {
      count: 12,
      amount: "₹24,500",
    },
    approved: {
      count: 45,
      amount: "₹78,250",
    },
    rejected: {
      count: 8,
      amount: "₹12,800",
    },
    total: {
      count: 65,
      amount: "₹115,550",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Requests
          </CardTitle>
          <Clock3Icon className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Amount: {stats.pending.amount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Approved Requests
          </CardTitle>
          <CheckCircle2Icon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approved.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Amount: {stats.approved.amount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rejected Requests
          </CardTitle>
          <XCircleIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rejected.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Amount: {stats.rejected.amount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Amount: {stats.total.amount}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
