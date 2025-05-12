import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpIcon, DollarSignIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/atoms/button";
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
import { Textarea } from "@/components/atoms/textarea";
import WalletService from "@/services/walletService";

function WithdrawalDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [nexusPoints, setNexusPoints] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      amount,
      withdrawalNote,
      nexusPoints,
    }: {
      amount: number;
      withdrawalNote: string;
      nexusPoints?: number;
    }) => WalletService.requestWithdrawal(amount, withdrawalNote, nexusPoints),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      alert(
        `Withdrawal request for $${withdrawalAmount}${nexusPoints ? ` and ${nexusPoints} Nexus Points` : ""} has been submitted to admin.`,
      );
      setWithdrawalAmount("");
      setWithdrawalReason("");
      setNexusPoints("");
      setIsOpen(false);
    },
    onError: () => {
      alert("Failed to submit withdrawal request.");
    },
  });

  const handleWithdrawalRequest = () => {
    const amount = parseFloat(withdrawalAmount);
    const points = nexusPoints ? parseInt(nexusPoints, 10) : undefined;

    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (points && (isNaN(points) || points < 0)) {
      alert("Please enter a valid number of Nexus Points.");
      return;
    }
    if (!withdrawalReason.trim()) {
      alert("Please provide a reason for the withdrawal.");
      return;
    }

    mutation.mutate({
      amount,
      withdrawalNote: withdrawalReason,
      nexusPoints: points,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Submit a request to withdraw funds or Nexus Points from your wallet.
            The admin will review your request.
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
            <Label htmlFor="nexusPoints" className="text-right">
              Nexus Points
            </Label>
            <div className="col-span-3 relative">
              <StarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="nexusPoints"
                type="number"
                placeholder="0"
                className="pl-8"
                value={nexusPoints}
                onChange={(e) => setNexusPoints(e.target.value)}
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
          <Button
            type="submit"
            onClick={handleWithdrawalRequest}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawalDialog;
