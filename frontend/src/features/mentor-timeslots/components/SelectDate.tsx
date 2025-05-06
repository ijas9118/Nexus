import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { format, addDays, startOfDay, isSameDay } from "date-fns";

interface SelectDateProps {
  onDateChange?: (date: Date | undefined) => void;
  selectedDate?: Date | undefined;
}

export default function SelectDate({
  onDateChange,
  selectedDate,
}: SelectDateProps = {}) {
  const today = startOfDay(new Date());
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const handleDateChange = (newDate: Date) => {
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <Card className="md:col-span-1 shadow-none rounded-md borde">
      <CardHeader>
        <CardTitle>Pick a Day</CardTitle>
        <CardDescription>
          Set your availability for one of the upcoming 7 days
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <h3>Available Dates</h3>
          <div className="grid grid-cols-2 gap-3">
            {nextSevenDays.map((date) => {
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateChange(date)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-400/30  border-blue-400/50"
                      : "border-muted-foreground/50 hover:bg-muted"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-sm">{format(date, "EEE, MMM d")}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
