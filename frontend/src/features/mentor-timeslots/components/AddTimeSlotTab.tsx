import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TimeSlotService from "@/services/TimeSlotService";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle, Loader2, X } from "lucide-react";
import TimeInput from "./TimeInput";
import TimeSlotListByDate from "./TimeSlotListByDate";
import { TimeSlot } from "@/types/mentor";

interface AddTimeSlotTabProps {
  date: Date | undefined;
  timeSlots: TimeSlot[];
  isLoading: boolean;
}

export default function AddTimeSlotTab({
  date,
  timeSlots,
  isLoading,
}: AddTimeSlotTabProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mentorId = useSelector((state: RootState) => state.auth.user?.mentorId);
  const queryClient = useQueryClient();

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
    onError: (err: unknown) => {
      // Handle the error based on its structure
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Failed to add time slot");
      }
    },
  });

  const deleteTimeSlotMutation = useMutation({
    mutationFn: (slotId: string) => TimeSlotService.deleteTimeSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", date ? format(date, "yyyy-MM-dd") : ""],
      });
      setError(null);
    },
    onError: (err: unknown) => {
      setError(
        err instanceof Error ? err.message : "Failed to delete time slot",
      );
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
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Alert variant="destructive" className="mb-4 ">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-1"
              onClick={() => setError(null)}
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <Label htmlFor="startTime">Select Start Time (1 hour duration)</Label>
          <div className="flex items-center space-x-2">
            <TimeInput
              value={startTime}
              onChange={setStartTime}
              disabled={!date || addTimeSlotMutation.isPending}
            />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleAddTimeSlot}
                disabled={!date || !startTime || addTimeSlotMutation.isPending}
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
    </>
  );
}
