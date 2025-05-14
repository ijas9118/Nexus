import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Transaction } from "../types";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                tx.type === "incoming"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700",
              )}
            >
              {tx.type === "incoming" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {tx.type === "incoming"
                  ? `Payment from ${tx.from}`
                  : "Withdrawal"}
              </p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
          </div>
          <div
            className={cn(
              "text-sm font-medium",
              tx.type === "incoming" ? "text-green-600" : "text-orange-600",
            )}
          >
            {tx.type === "incoming" ? "+" : "-"}${tx.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
