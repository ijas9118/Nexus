import ScheduleCallCard from "./components/ScheduleCallCard";
import CalenderCard from "./components/CalenderCard";

const ScheduleCallsManagement = () => {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <ScheduleCallCard />
        <CalenderCard />
      </div>
    </div>
  );
};

export default ScheduleCallsManagement;
