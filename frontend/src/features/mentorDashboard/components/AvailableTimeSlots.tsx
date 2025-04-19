import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Progress } from "@/components/molecules/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Clock } from "lucide-react";

const AvailableTimeSlots = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Time Slot Availability</CardTitle>
        <CardDescription>
          Your current availability for mentorship
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekdays</span>
              <span className="text-sm text-muted-foreground">
                8 slots available
              </span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekends</span>
              <span className="text-sm text-muted-foreground">
                4 slots available
              </span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
          <div className="pt-4">
            <Tabs defaultValue="weekdays">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekdays">Weekdays</TabsTrigger>
                <TabsTrigger value="weekends">Weekends</TabsTrigger>
              </TabsList>
              <TabsContent value="weekdays" className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "9:00 AM - 10:00 AM",
                    "10:00 AM - 11:00 AM",
                    "2:00 PM - 3:00 PM",
                    "3:00 PM - 4:00 PM",
                  ].map((slot, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{slot}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="weekends" className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"].map(
                    (slot, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{slot}</span>
                      </div>
                    ),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableTimeSlots;
