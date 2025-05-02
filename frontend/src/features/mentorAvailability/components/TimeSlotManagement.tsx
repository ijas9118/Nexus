import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Trash2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import TimeSlotList from "./time-slot-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TimeSlotService from "@/services/TimeSlotService";
import { motion } from "framer-motion";
import TimeInput from "./TimeInput";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TimeSlotListByDate from "./TimeSlotListByDate";

interface TimeSlotManagementProps {
  date?: Date;
}

export default function TimeSlotManagement({ date }: TimeSlotManagementProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mentorId = useSelector((state: RootState) => state.auth.user?.mentorId);
  const queryClient = useQueryClient();

  // Fetch time slots for selected date
  const { data: timeSlots = [], isLoading } = useQuery({
    queryKey: ["timeSlots", date ? format(date, "yyyy-MM-dd") : ""],
    queryFn: () =>
      date
        ? TimeSlotService.getTimeSlotsByDate(format(date, "yyyy-MM-dd"))
        : Promise.resolve([]),
    enabled: !!date,
  });

  // Mutation for adding time slot
  const addTimeSlotMutation = useMutation({
    mutationFn: () =>
      TimeSlotService.addTimeSlot(
        format(date!, "yyyy-MM-dd"),
        startTime,
        mentorId as string,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", date ? format(date, "yyyy-MM-dd") : ""],
      });
      setStartTime("");
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || "Failed to add time slot");
    },
  });

  // Mutation for deleting time slot
  const deleteTimeSlotMutation = useMutation({
    mutationFn: (slotId: string) => TimeSlotService.deleteTimeSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", date ? format(date, "yyyy-MM-dd") : ""],
      });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || "Failed to delete time slot");
    },
  });

  const handleAddTimeSlot = () => {
    if (!date || !startTime) return;
    addTimeSlotMutation.mutate();
  };

  const handleDeleteTimeSlot = (slotId: string) => {
    deleteTimeSlotMutation.mutate(slotId);
  };

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
          </TabsList>
          <TabsContent value="add">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="startTime">
                  Select Start Time (1 hour duration)
                </Label>
                <div className="flex items-center space-x-2">
                  <TimeInput
                    value={startTime}
                    onChange={setStartTime}
                    disabled={!date || addTimeSlotMutation.isPending}
                  />
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAddTimeSlot}
                      disabled={
                        !date || !startTime || addTimeSlotMutation.isPending
                      }
                      className="relative overflow-hidden"
                    >
                      {addTimeSlotMutation.isPending ? (
                        <span className="flex items-center">
                          <Loader2 className="animate-spin -ml-1 mr-2" />
                          Adding...
                        </span>
                      ) : (
                        "Add Slot"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Time Slots for{" "}
                  {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
                </h3>
                <TimeSlotListByDate
                  timeSlots={timeSlots}
                  isLoading={isLoading}
                  isDeleting={deleteTimeSlotMutation.isPending}
                  onDelete={handleDeleteTimeSlot}
                />
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
