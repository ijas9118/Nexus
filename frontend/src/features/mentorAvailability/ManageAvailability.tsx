import { useState } from "react";
import AvailabilitySettings from "./components/AvailabilitySettings";
import TimeSlotManagement from "./components/TimeSlotManagement";

export default function MentorAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-">
      <h1 className="text-2xl font-bold mb-8">Manage Your Availability</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AvailabilitySettings
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
        />
        <TimeSlotManagement date={selectedDate} />
      </div>
    </div>
  );
}
