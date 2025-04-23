import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Trash2, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { TimeSlot } from "@/types/mentor";

export default function TimeSlotList() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTimeSlots();
  }, []);

  const fetchAllTimeSlots = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/mentors/time-slots/all");

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const data = await response.json();
      setTimeSlots(data);
    } catch (err) {
      setError("Error loading time slots. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/mentors/time-slots/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete time slot");
      }

      // Refresh time slots
      fetchAllTimeSlots();
    } catch (err: any) {
      setError(err.message || "Error deleting time slot. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group time slots by date
  const groupedTimeSlots = timeSlots.reduce(
    (groups, slot) => {
      const date = format(parseISO(slot.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    },
    {} as Record<string, TimeSlot[]>,
  );

  if (isLoading && timeSlots.length === 0) {
    return <p>Loading time slots...</p>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (timeSlots.length === 0) {
    return <p className="text-muted-foreground">No time slots found.</p>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTimeSlots)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, slots]) => (
          <Card key={date} className="overflow-hidden">
            <div className="bg-muted p-3 font-medium">
              {format(parseISO(date), "EEEE, MMMM d, yyyy")}
            </div>
            <CardContent className="p-3">
              <ul className="space-y-2">
                {slots
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((slot) => (
                    <li
                      key={slot._id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.isBooked && (
                          <Badge variant="secondary">Booked</Badge>
                        )}
                      </div>
                      {!slot.isBooked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTimeSlot(slot._id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
