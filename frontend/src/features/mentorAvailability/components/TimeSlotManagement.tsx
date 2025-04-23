import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Trash2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { TimeSlot } from "@/types/mentor";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import TimeSlotList from "./time-slot-list";

interface TimeSlotManagementProps {
  date?: Date;
}

export default function TimeSlotManagement({ date }: TimeSlotManagementProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return {
      value: `${hour}:00`,
      label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
    };
  });

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Time Slots Management</CardTitle>
        <CardDescription>
          {date
            ? `For ${format(date, "EEEE, MMMM d, yyyy")}`
            : "Select a date to manage time slots"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add">
          <TabsList className="mb-4">
            <TabsTrigger value="add">Add Time Slots</TabsTrigger>
            <TabsTrigger value="view">View All Time Slots</TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="startTime">
                  Select Start Time (1 hour duration)
                </Label>
                <div className="flex items-center space-x-2">
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button disabled={!date || !startTime || isLoading}>
                    Add Slot
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Time Slots for{" "}
                  {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
                </h3>
                {isLoading ? (
                  <p>Loading time slots...</p>
                ) : timeSlots.length > 0 ? (
                  <ul className="space-y-2">
                    {timeSlots.map((slot) => (
                      <li
                        key={slot._id}
                        className="flex items-center justify-between p-3 border rounded-md"
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
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No time slots added for this date yet.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="view">
            <TimeSlotList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
