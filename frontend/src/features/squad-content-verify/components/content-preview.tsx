import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { toast } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ContentItem } from "../VerifyContentPage";
import { approveContent } from "./content-service";

interface ContentPreviewProps {
  selectedContent: ContentItem | null;
  setSelectedContent: (content: ContentItem | null) => void;
  openRejectDialog: () => void;
  squadId: string;
  queryClient: QueryClient;
}

export default function ContentPreview({
  selectedContent,
  setSelectedContent,
  openRejectDialog,
  squadId,
  queryClient,
}: ContentPreviewProps) {
  // Approve content mutation
  const approveMutation = useMutation({
    mutationFn: (contentId: string) => approveContent(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingContent", squadId] });
      toast.success("Content approved successfully");
      setSelectedContent(null);
    },
    onError: () => {
      toast.error("Failed to approve content");
    },
  });

  const handleApprove = () => {
    if (selectedContent) {
      approveMutation.mutate(selectedContent.id);
    }
  };

  if (!selectedContent) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border border-dashed p-12">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Select Content to Review</h3>
          <p className="text-muted-foreground">
            Choose an item from the queue to review and verify
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{selectedContent.title}</CardTitle>
            <CardDescription>
              Submitted{" "}
              {formatDistanceToNow(new Date(selectedContent.createdAt), {
                addSuffix: true,
              })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedContent.isPremium && (
              <Badge variant="secondary">Premium Content</Badge>
            )}
            <Badge variant="outline" className="capitalize">
              {selectedContent.contentType}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage
              src={selectedContent.authorProfilePic || "/placeholder.svg"}
            />
            <AvatarFallback>
              {selectedContent.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{selectedContent.authorName}</div>
            <div className="text-sm text-muted-foreground">
              @{selectedContent.authorUsername}
            </div>
          </div>
        </div>

        {selectedContent.thumbnailUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={selectedContent.thumbnailUrl || "/placeholder.svg"}
              alt={selectedContent.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: selectedContent.content }} />
        </div>

        <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{selectedContent.viewCount} views</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{selectedContent.commentCount} comments</span>
          </div>
        </div>

        {selectedContent.status === "rejected" &&
          selectedContent.rejectionReason && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <h4 className="font-medium text-destructive mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Rejection Reason
              </h4>
              <p className="text-sm">{selectedContent.rejectionReason}</p>
            </div>
          )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setSelectedContent(null)}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {selectedContent.status === "pending" && (
            <>
              <Button variant="destructive" onClick={openRejectDialog}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>
            </>
          )}
          {selectedContent.status === "approved" && (
            <Button variant="destructive" onClick={openRejectDialog}>
              <XCircle className="mr-2 h-4 w-4" />
              Revoke Approval
            </Button>
          )}
          {selectedContent.status === "rejected" && (
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
