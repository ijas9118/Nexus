import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { toast } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ContentItem } from "../VerifyContentPage";
import { rejectContent } from "./content-service";

interface RejectDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  selectedContent: ContentItem | null;
  squadId: string;
  queryClient: QueryClient;
}

export default function RejectDialog({
  isOpen,
  setIsOpen,
  rejectionReason,
  setRejectionReason,
  selectedContent,
  squadId,
  queryClient,
}: RejectDialogProps) {
  // Reject content mutation
  const rejectMutation = useMutation({
    mutationFn: ({
      contentId,
      reason,
    }: {
      contentId: string;
      reason: string;
    }) => rejectContent(contentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingContent", squadId] });
      toast.success("Content rejected");
      setIsOpen(false);
      setRejectionReason("");
    },
    onError: () => {
      toast.error("Failed to reject content");
    },
  });

  const handleReject = () => {
    if (selectedContent && rejectionReason.trim()) {
      rejectMutation.mutate({
        contentId: selectedContent.id,
        reason: rejectionReason,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Content</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this content. This will be
            visible to the author.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Explain why this content is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!rejectionReason.trim() || rejectMutation.isPending}
          >
            {rejectMutation.isPending ? "Rejecting..." : "Reject Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
