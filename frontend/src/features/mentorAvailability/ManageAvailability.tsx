import AvailabilitySettings from "./components/AvailabilitySettings";
import TimeSlotManagement from "./components/TimeSlotManagement";

export default function MentorAvailabilityPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-">
      <h1 className="text-2xl font-bold mb-8">Manage Your Availability</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AvailabilitySettings />
        <TimeSlotManagement />
      </div>
    </div>
  );
}
