import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms/button";
import { Calendar } from "@/components/organisms/calendar";
import { AvailabilityType } from "@/types/mentor";
import { isBefore, startOfDay, isWeekend } from "date-fns";
import { useMentorAvailability } from "../hooks/useMentorAvailability";

interface AvailabilitySettingsProps {
  onDateChange?: (date: Date | undefined) => void;
  selectedDate?: Date | undefined;
}
export default function AvailabilitySettings({
  onDateChange,
  selectedDate,
}: AvailabilitySettingsProps = {}) {
  const {
    availabilityType,
    setAvailabilityType,
    originalAvailabilityType,
    isFetchingAvailability,
    isError,
    isPending,
    handleAvailabilityChange,
  } = useMentorAvailability();

  const handleDateChange = (newDate: Date | undefined) => {
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const disabledDays = (date: Date) => {
    if (availabilityType === "weekdays" && isWeekend(date)) {
      return true;
    }
    if (availabilityType === "weekend" && !isWeekend(date)) {
      return true;
    }
    return false;
  };

  return (
    <Card className="md:col-span-1 shadow-none rounded-md">
      <CardHeader>
        <CardTitle>Availability Settings</CardTitle>
        <CardDescription>
          {isFetchingAvailability
            ? "Fetching availability..."
            : "Set your general availability preferences"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFetchingAvailability ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load availability.</p>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Availability Type</h3>
              <RadioGroup
                value={availabilityType}
                onValueChange={(value) =>
                  setAvailabilityType(value as AvailabilityType)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekdays" id="weekdays" />
                  <Label htmlFor="weekdays">Weekdays Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekend" id="weekend" />
                  <Label htmlFor="weekend">Weekends Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both Weekdays and Weekends</Label>
                </div>
              </RadioGroup>
              <Button
                className="mt-4 w-full"
                onClick={() => handleAvailabilityChange(availabilityType)}
                disabled={
                  isPending || availabilityType === originalAvailabilityType
                }
              >
                {isPending ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Select Date</h3>
              <div className="flex items-center justify-start w-full">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    isBefore(date, startOfDay(new Date())) || disabledDays(date)
                  }
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
