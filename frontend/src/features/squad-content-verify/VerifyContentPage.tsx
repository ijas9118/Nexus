import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/atoms/button";
import ContentList from "./components/content-list";
import ContentPreview from "./components/content-preview";
import RejectDialog from "./components/reject-dialog";
import { fetchPendingContent } from "./components/content-service";

// Types - exported for reuse in other components
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  contentType: "article" | "video" | "image" | "poll";
  thumbnailUrl?: string;
  authorName: string;
  authorUsername: string;
  authorProfilePic?: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  isPremium: boolean;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

// Main component
export default function VerifyContentPage() {
  // In a real app, you'd get this from the route params
  const squadId = "squad123";
  const queryClient = useQueryClient();

  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch pending content
  const { data: pendingContent, isLoading } = useQuery({
    queryKey: ["pendingContent", squadId],
    queryFn: () => fetchPendingContent(),
  });

  const openRejectDialog = () => {
    setIsRejectDialogOpen(true);
  };

  const filteredContent = pendingContent?.filter((content) => {
    if (activeTab === "pending") return content.status === "pending";
    if (activeTab === "approved") return content.status === "approved";
    if (activeTab === "rejected") return content.status === "rejected";
    return true;
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Content Verification</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="md:col-span-1">
          <ContentList
            filteredContent={filteredContent || []}
            isLoading={isLoading}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content Preview */}
        <div className="md:col-span-2">
          <ContentPreview
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            openRejectDialog={openRejectDialog}
            squadId={squadId}
            queryClient={queryClient}
          />
        </div>
      </div>

      {/* Rejection Dialog */}
      <RejectDialog
        isOpen={isRejectDialogOpen}
        setIsOpen={setIsRejectDialogOpen}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        selectedContent={selectedContent}
        squadId={squadId}
        queryClient={queryClient}
      />
    </div>
  );
}
