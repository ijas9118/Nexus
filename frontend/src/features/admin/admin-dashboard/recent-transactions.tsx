import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";

const transactions = [
  {
    id: "tx1",
    type: "incoming",
    date: "2023-08-15",
    amount: 45.0,
    status: "completed",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    description: "Platform fee from mentorship session",
  },
  {
    id: "tx2",
    type: "incoming",
    date: "2023-08-14",
    amount: 120.0,
    status: "completed",
    user: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    description: "Fire subscription plan (12 months)",
  },
  {
    id: "tx3",
    type: "withdrawal",
    date: "2023-08-13",
    amount: 500.0,
    status: "pending",
    user: {
      name: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AD",
    },
    description: "Monthly withdrawal to bank account",
  },
  {
    id: "tx4",
    type: "incoming",
    date: "2023-08-12",
    amount: 25.0,
    status: "completed",
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    description: "Spark subscription plan (1 month)",
  },
  {
    id: "tx5",
    type: "incoming",
    date: "2023-08-11",
    amount: 35.0,
    status: "completed",
    user: {
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
    },
    description: "Platform fee from mentorship session",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={transaction.user.avatar || "/placeholder.svg"}
                alt={transaction.user.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                {transaction.user.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {transaction.description}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p
              className={`text-sm font-semibold ${
                transaction.type === "incoming"
                  ? "text-green-600 dark:text-green-500"
                  : "text-red-600 dark:text-red-500"
              }`}
            >
              {transaction.type === "incoming" ? "+" : "-"}$
              {transaction.amount.toFixed(2)}
            </p>
            <Badge
              variant="outline"
              className={`text-xs ${
                transaction.status === "completed"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-amber-500 text-amber-600 dark:text-amber-500"
              }`}
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
