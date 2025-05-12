import { IndianRupee } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";

interface WalletBalanceCardProps {
  balance: number;
}

function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
        <IndianRupee className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">₹{balance.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground">
          Updated as of {new Date().toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

export default WalletBalanceCard;
