import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Calendar } from "@/components/organisms/calendar";
import { useState } from "react";
import { upcomingCalls } from "./ScheduleCallCard";
import { Clock } from "lucide-react";

const CalenderCard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Your mentorship schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />

        <div className="mt-4 space-y-2">
          <h3 className="font-medium">
            Sessions on {date?.toLocaleDateString()}
          </h3>
          {upcomingCalls.filter((call) => call.date === "2025-04-20").length >
          0 ? (
            upcomingCalls
              .filter((call) => call.date === "2025-04-20")
              .map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{call.time}</span>
                  </div>
                  <span className="font-medium">{call.mentee.name}</span>
                </div>
              ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No sessions scheduled for this day
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalenderCard;
