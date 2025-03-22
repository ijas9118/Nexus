import { Button } from "@/components/atoms/button";
import { Calendar } from "@/components/organisms/calendar";
import { CalendarIcon, Clock } from "lucide-react";

interface DateTimeSelectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string | undefined;
  setTimeSlot: (time: string) => void;
  onBack: () => void;
  onContinue: () => void;
  timeSlots: string[];
  step: number;
}

const DateTimeSelection = ({
  date,
  setDate,
  timeSlot,
  step,
  setTimeSlot,
  onBack,
  onContinue,
  timeSlots,
}: DateTimeSelectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">2. Select date and time</h2>

      <div className={step === 2 ? "block" : "hidden"}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date: Date) => {
                // Disable dates in the past and weekends in this example
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const day = date.getDay();
                return date < now || day === 0 || day === 6;
              }}
              className="rounded-md border"
            />
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Available time slots</div>
            {date ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={timeSlot === time ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setTimeSlot(time)}
                  >
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Select a date to view available times
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onContinue} disabled={!date || !timeSlot}>
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default DateTimeSelection;
