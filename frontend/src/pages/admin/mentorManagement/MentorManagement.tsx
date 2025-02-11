import { FC, useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./components/data-table";
import { Mentor } from "@/types/mentor";
import MentorService from "@/services/admin/mentorService";

const MentorManagement: FC = () => {
  const [data, setData] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentors = await MentorService.getAllMentors();
        console.log(mentors);
        setData(mentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  const resendInvite = async (email: string) => {
    try {
      await fetch(`/api/mentors/invite`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      alert("Invite resent successfully");
    } catch (error) {
      console.error("Failed to resend invite:", error);
    }
  };

  const revokeMentor = async (id: string) => {
    setData((prevData) => prevData.filter((mentor) => mentor._id !== id));

    try {
      await fetch(`/api/mentors/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to revoke mentor:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <DataTable columns={columns(resendInvite, revokeMentor)} data={data} />
    </div>
  );
};

export default MentorManagement;
