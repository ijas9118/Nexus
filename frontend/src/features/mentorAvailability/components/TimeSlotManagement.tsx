import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { format } from "date-fns";
import TimeSlotList from "./time-slot-list";
import { useQuery } from "@tanstack/react-query";
import TimeSlotService from "@/services/TimeSlotService";
import BookedTimeSlots from "./BookedTimeSlots";
import AddTimeSlotTab from "./AddTimeSlotTab";

interface TimeSlotManagementProps {
  date?: Date;
}

export default function TimeSlotManagement({ date }: TimeSlotManagementProps) {
  const { data: timeSlots = [], isLoading } = useQuery({
    queryKey: ["timeSlots", date ? format(date, "yyyy-MM-dd") : ""],
    queryFn: () =>
      date
        ? TimeSlotService.getTimeSlotsByDate(format(date, "yyyy-MM-dd"))
        : Promise.resolve([]),
    enabled: !!date,
  });

  return (
    <Card className="md:col-span-2 shadow-none rounded-md">
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
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="add" className="w-full">
              Add Time Slots
            </TabsTrigger>
            <TabsTrigger value="view" className="w-full">
              View All Time Slots
            </TabsTrigger>
            <TabsTrigger value="booked" className="w-full">
              View Booked Slots
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <AddTimeSlotTab
              date={date}
              timeSlots={timeSlots}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="view">
            <TimeSlotList />
          </TabsContent>
          <TabsContent value="booked">
            <BookedTimeSlots />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
