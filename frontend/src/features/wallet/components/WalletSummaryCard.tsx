import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { TransactionDetails } from "@/types/wallet";

interface WalletSummaryCardProps {
  transactions: TransactionDetails[];
  type: "incoming" | "withdrawal";
}

function WalletSummaryCard({ transactions, type }: WalletSummaryCardProps) {
  const filteredTransactions = transactions.filter((t) => t.type === type);
  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {type === "incoming" ? "Incoming" : "Outgoing"} (This Month)
        </CardTitle>
        {type === "incoming" ? (
          <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
        ) : (
          <ArrowUpIcon className="h-4 w-4 text-rose-500" />
        )}
      </CardHeader>
      <CardContent>
        <div
          className={`text-3xl font-bold ${type === "incoming" ? "text-emerald-500" : "text-rose-500"}`}
        >
          ₹{totalAmount.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          From {filteredTransactions.length}{" "}
          {type === "incoming" ? "bookings" : "withdrawals"}
        </p>
      </CardContent>
    </Card>
  );
}

export default WalletSummaryCard;
