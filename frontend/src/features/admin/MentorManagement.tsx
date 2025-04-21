import { FC, useState } from "react";
import { columns } from "./mentorManagement/columns";
import { DataTable } from "./mentorManagement/components/data-table";
import MentorService from "@/services/mentorService";
import { useQuery } from "@tanstack/react-query";
import { MentorDetailsDialog } from "./mentorManagement/components/MentorDetailsDialog";

interface MentorDetails {
  _id: string;
  userId: {
    name: string;
    email: string;
    username: string;
    profilePic?: string;
  };
  experience: {
    currentRole: string;
    company: string;
    experienceLevel: string;
    expertiseAreas: string[];
    technologies: string[];
    bio: string;
  };
  mentorshipDetails: {
    mentorshipTypes: string[];
    targetAudiences: string[];
    availabilityType: string;
    motivation: string;
  };
  status: string;
  createdAt: string;
}

const MentorManagement: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  const {
    data: mentors = [],
    isLoading: isMentorsLoading,
    isError: isMentorsError,
  } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const mentors: any = await MentorService.getAllMentors();
      return mentors.map((mentor: any) => ({
        _id: mentor._id,
        name: mentor.userId?.name || "N/A",
        email: mentor.userId?.email || "N/A",
        username: mentor.userId?.username || "N/A",
        profilePic: mentor.userId?.profilePic || "",
        status: mentor.status,
        createdAt: new Date(mentor.createdAt).toLocaleDateString(),
      }));
    },
  });

  const {
    data: mentorDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
  } = useQuery({
    queryKey: ["mentor", selectedMentorId],
    queryFn: () => MentorService.getMentorDetails(selectedMentorId!),
    enabled: !!selectedMentorId, // Only fetch when selectedMentorId is set
  });

  console.log(mentorDetails);

  const handleRowClick = (mentor: any) => {
    setSelectedMentorId(mentor._id);
    setDialogOpen(true);
  };

  const hanldeBlock = (mentor: any) => {
    console.log(mentor);
  };

  if (isMentorsLoading) {
    return <div className="p-6 text-lg">Loading mentors...</div>;
  }

  if (isMentorsError) {
    return <div className="p-6 text-red-500">Failed to load mentors 😬</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">Mentor Management</h1>

      <DataTable
        columns={columns(handleRowClick, hanldeBlock)} // Pass handleRowClick to columns
        data={mentors}
        onRowClick={handleRowClick} // Add row click handler
      />

      <MentorDetailsDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedMentorId(null); // Reset query key when closing
        }}
        mentorDetails={mentorDetails}
        isLoading={isDetailsLoading}
        isError={isDetailsError}
      />
    </div>
  );
};

export default MentorManagement;
