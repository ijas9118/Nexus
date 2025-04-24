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

interface TimeSlotManagementProps {
  date?: Date;
}

export default function TimeSlotManagement({ date }: TimeSlotManagementProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
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
      TimeSlotService.addTimeSlot(format(date!, "yyyy-MM-dd"), startTime),
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

  // Animation variants for time slot list
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 12 } },
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
                    min="09:00"
                    max="21:00"
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
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-800" />
                  </div>
                ) : timeSlots.length > 0 ? (
                  <motion.ul
                    className="space-y-2"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {timeSlots.map((slot) => (
                      <motion.li
                        key={slot._id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted transition-colors duration-200"
                        variants={itemVariants}
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.isBooked && (
                            <Badge
                              variant="secondary"
                              className="ml-2 animate-pulse"
                            >
                              Booked
                            </Badge>
                          )}
                        </div>
                        {!slot.isBooked && (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTimeSlot(slot._id)}
                              disabled={deleteTimeSlotMutation.isPending}
                              className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.p
                    className="text-muted-foreground text-center p-6 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    No time slots added for this date yet.
                  </motion.p>
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
