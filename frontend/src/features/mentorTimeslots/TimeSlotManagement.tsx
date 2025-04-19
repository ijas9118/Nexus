import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const TimeSlotManagement = () => {
  const [availabilityType, setAvailabilityType] = useState("both");
  const [weekdaySlots, setWeekdaySlots] = useState([
    { id: 1, day: "Monday", time: "9:00 AM - 10:00 AM", isBooked: false },
    { id: 2, day: "Monday", time: "2:00 PM - 3:00 PM", isBooked: true },
    { id: 3, day: "Tuesday", time: "10:00 AM - 11:00 AM", isBooked: false },
    { id: 4, day: "Wednesday", time: "1:00 PM - 2:00 PM", isBooked: false },
    { id: 5, day: "Thursday", time: "4:00 PM - 5:00 PM", isBooked: false },
    { id: 6, day: "Friday", time: "11:00 AM - 12:00 PM", isBooked: true },
  ]);

  const [weekendSlots, setWeekendSlots] = useState([
    { id: 7, day: "Saturday", time: "10:00 AM - 11:00 AM", isBooked: false },
    { id: 8, day: "Saturday", time: "3:00 PM - 4:00 PM", isBooked: false },
    { id: 9, day: "Sunday", time: "2:00 PM - 3:00 PM", isBooked: true },
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Time Slot Management</CardTitle>
          <CardDescription>
            Configure your availability for mentorship sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Availability Preference</h3>
              <p className="text-sm text-muted-foreground">
                Choose when you're available for mentorship
              </p>
            </div>

            <RadioGroup
              value={availabilityType}
              onValueChange={setAvailabilityType}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
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
                <Label htmlFor="both">Both Weekdays & Weekends</Label>
              </div>
            </RadioGroup>
          </div>

          <Tabs defaultValue="weekdays">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="weekdays"
                disabled={availabilityType === "weekend"}
              >
                Weekdays
              </TabsTrigger>
              <TabsTrigger
                value="weekends"
                disabled={availabilityType === "weekdays"}
              >
                Weekends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekdays" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Weekday Time Slots</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slot
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Day</div>
                  <div className="col-span-4">Time</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {weekdaySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="grid grid-cols-12 items-center border-b p-3 text-sm last:border-0"
                  >
                    <div className="col-span-3">{slot.day}</div>
                    <div className="col-span-4 flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {slot.time}
                    </div>
                    <div className="col-span-3">
                      {slot.isBooked ? (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 hover:bg-orange-100 hover:text-orange-800"
                        >
                          Booked
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Available
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={slot.isBooked}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekends" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Weekend Time Slots</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slot
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Day</div>
                  <div className="col-span-4">Time</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {weekendSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="grid grid-cols-12 items-center border-b p-3 text-sm last:border-0"
                  >
                    <div className="col-span-3">{slot.day}</div>
                    <div className="col-span-4 flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {slot.time}
                    </div>
                    <div className="col-span-3">
                      {slot.isBooked ? (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 hover:bg-orange-100 hover:text-orange-800"
                        >
                          Booked
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Available
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={slot.isBooked}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Session Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your mentorship session preferences
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session-duration">
                  Default Session Duration
                </Label>
                <Select defaultValue="60">
                  <SelectTrigger id="session-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buffer-time">
                  Buffer Time Between Sessions
                </Label>
                <Select defaultValue="15">
                  <SelectTrigger id="buffer-time">
                    <SelectValue placeholder="Select buffer time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-confirm" />
                <Label htmlFor="auto-confirm">
                  Automatically confirm new mentorship requests
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reminder" defaultChecked />
                <Label htmlFor="reminder">
                  Send email reminders before sessions
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TimeSlotManagement;
