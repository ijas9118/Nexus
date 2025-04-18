import { FC } from "react";
import { columns } from "./mentorManagement/columns";
import { DataTable } from "./mentorManagement/components/data-table";
import MentorService from "@/services/mentorService";
import { useQuery } from "@tanstack/react-query";

const MentorManagement: FC = () => {
  const {
    data = [],
    isLoading,
    isError,
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

  if (isLoading) {
    return <div className="p-6 text-lg">Loading mentors...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load mentors 😬</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">Mentor Management</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default MentorManagement;
