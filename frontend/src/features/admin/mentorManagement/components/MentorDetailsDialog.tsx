import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { Mentor } from "@/types/mentor";
import { toast } from "sonner";
import MentorService from "@/services/mentorService";

interface MentorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorDetails: Mentor | undefined;
  isLoading: boolean;
  isError: boolean;
  refetchMentorDetails: () => void;
}

export const MentorDetailsDialog: FC<MentorDetailsDialogProps> = ({
  open,
  onOpenChange,
  mentorDetails,
  isLoading,
  isError,
  refetchMentorDetails,
}) => {
  const [isApproving, setIsApproving] = useState(false); // State for approval loading
  const [approveError, setApproveError] = useState<string | null>(null); // State for approval error

  const handleApproveMentor = async () => {
    if (!mentorDetails?._id || !mentorDetails?.userId._id) {
      toast.error("Missing mentor or user ID.");
      return;
    }

    setIsApproving(true);
    setApproveError(null);

    try {
      await MentorService.approveMentor(
        mentorDetails._id,
        mentorDetails.userId._id,
      );
      toast.success("Mentor approved successfully!");
      refetchMentorDetails(); // Refresh mentor details to show updated status
      onOpenChange(false); // Optionally close the dialog
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve mentor.";
      setApproveError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[80vw] max-w-7xl p-6 sm:p-8 bg-background"
        role="dialog"
        aria-describedby="mentor-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-foreground">
            Mentor Profile
          </DialogTitle>
          <DialogDescription
            id="mentor-dialog-description"
            className="text-muted-foreground text-base"
          >
            Detailed information about the selected mentor.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center py-8 text-base">
            Failed to load mentor details 😬
          </p>
        ) : mentorDetails ? (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid gap-6 md:grid-cols-3">
              {/* User Info Section */}
              <div className="md:col-span-1 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      mentorDetails.userId.profilePic ||
                      "https://avatar.iran.liara.run/public"
                    }
                    alt={`${mentorDetails.userId.name}'s profile`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {mentorDetails.userId.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{mentorDetails.userId.username}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-base">
                  <div>
                    <strong className="font-medium text-foreground">
                      Email:
                    </strong>{" "}
                    <a
                      href={`mailto:${mentorDetails.userId.email}`}
                      className="text-primary hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {mentorDetails.userId.email}
                    </a>
                  </div>
                  {mentorDetails.userId.location && (
                    <div>
                      <strong className="font-medium text-foreground">
                        Location:
                      </strong>{" "}
                      {mentorDetails.userId.location}
                    </div>
                  )}
                  <div>
                    <strong className="font-medium text-foreground">
                      Status:
                    </strong>{" "}
                    <Badge
                      variant={
                        mentorDetails.status === "approved"
                          ? "default"
                          : mentorDetails.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                      className="mt-1"
                    >
                      {mentorDetails.status === "approved"
                        ? "Accepted"
                        : mentorDetails.status === "pending"
                          ? "Pending"
                          : "Rejected"}
                    </Badge>
                  </div>
                  <div>
                    <strong className="font-medium text-foreground">
                      Joined:
                    </strong>{" "}
                    {new Date(mentorDetails.createdAt).toLocaleDateString()}
                  </div>
                  {mentorDetails.updatedAt && (
                    <div>
                      <strong className="font-medium text-foreground">
                        Last Updated:
                      </strong>{" "}
                      {new Date(mentorDetails.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Experience & Mentorship Details Section */}
              <div className="md:col-span-2 space-y-6">
                {/* Professional Experience */}
                <div className="border rounded-lg p-6 bg-card shadow-sm">
                  <h4 className="text-xl font-semibold text-foreground mb-4">
                    Professional Experience
                  </h4>
                  <div className="space-y-3 text-base">
                    <div>
                      <strong className="font-medium text-foreground">
                        Role:
                      </strong>{" "}
                      {mentorDetails.experience.currentRole}
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Company:
                      </strong>{" "}
                      {mentorDetails.experience.company}
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Experience Level:
                      </strong>{" "}
                      {mentorDetails.experience.experienceLevel.label} years
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Expertise Areas:
                      </strong>{" "}
                      <span className="flex flex-wrap gap-2">
                        {mentorDetails.experience.expertiseAreas.map((area) => (
                          <Badge
                            key={area._id}
                            variant="secondary"
                            className="capitalize hover:bg-muted transition-colors"
                          >
                            {area.name}
                          </Badge>
                        ))}
                      </span>
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Technologies:
                      </strong>{" "}
                      <span className="flex flex-wrap gap-2">
                        {mentorDetails.experience.technologies.map((tech) => (
                          <Badge
                            key={tech._id}
                            variant="outline"
                            className="capitalize hover:bg-muted transition-colors"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                      </span>
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Bio:
                      </strong>{" "}
                      {mentorDetails.experience.bio}
                    </div>
                    {/* <div>
                      <strong className="font-medium text-foreground">
                        Resume:
                      </strong>{" "}
                      {mentorDetails.experience.resume ? (
                        <a
                          href={mentorDetails.experience.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          Not provided
                        </span>
                      )}
                    </div> */}
                  </div>
                </div>

                {/* Mentorship Details */}
                <div className="border rounded-lg p-6 bg-card shadow-sm">
                  <h4 className="text-xl font-semibold text-foreground mb-4">
                    Mentorship Details
                  </h4>
                  <div className="space-y-3 text-base">
                    <div>
                      <strong className="font-medium text-foreground">
                        Mentorship Types:
                      </strong>{" "}
                      <span className="flex flex-wrap gap-2">
                        {mentorDetails.mentorshipDetails.mentorshipTypes.map(
                          (type) => (
                            <Badge
                              key={type._id}
                              variant="secondary"
                              className="capitalize hover:bg-muted transition-colors"
                            >
                              {type.name}
                            </Badge>
                          ),
                        )}
                      </span>
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Target Audiences:
                      </strong>{" "}
                      <span className="flex flex-wrap gap-2">
                        {mentorDetails.mentorshipDetails.targetAudiences.map(
                          (audience) => (
                            <Badge
                              key={audience._id}
                              variant="outline"
                              className="capitalize hover:bg-muted transition-colors"
                            >
                              {audience.name}
                            </Badge>
                          ),
                        )}
                      </span>
                    </div>
                    <div>
                      <strong className="font-medium text-foreground">
                        Motivation:
                      </strong>{" "}
                      {mentorDetails.mentorshipDetails.motivation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center py-8 text-base">
            No mentor details available.
          </p>
        )}
        {approveError && (
          <p className="text-red-500 text-center py-2 text-sm">
            {approveError}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-6">
          {mentorDetails?.status === "pending" && (
            <Button
              variant="default"
              onClick={handleApproveMentor}
              disabled={isApproving}
              aria-label="Approve mentor application"
              className="flex items-center gap-2"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve"
              )}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            aria-label="Close mentor details dialog"
            className="hover:bg-muted transition-colors"
            disabled={isApproving}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
