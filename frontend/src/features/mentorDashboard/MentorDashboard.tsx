import AvailableTimeSlots from "./components/AvailableTimeSlots";
import MenteeRequests from "./components/MenteeRequestsCard";
import MentorshipInsights from "./components/mentorship-insights";
import MentorStats from "./components/MentorStats";

const MentorDashboard = () => {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <MentorStats />
      <MenteeRequests />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AvailableTimeSlots />
        <MentorshipInsights />
      </div>
    </div>
  );
};

export default MentorDashboard;
