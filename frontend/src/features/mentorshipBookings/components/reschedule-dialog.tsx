import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/organisms/calendar";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import BookingService from "@/services/bookingService";
import { toast } from "sonner";

// Mock time slots - in a real app, these would be fetched from the API
const TIME_SLOTS = [
  { id: "1", startTime: "09:00 AM", endTime: "10:00 AM" },
  { id: "2", startTime: "10:00 AM", endTime: "11:00 AM" },
  { id: "3", startTime: "11:00 AM", endTime: "12:00 PM" },
  { id: "4", startTime: "01:00 PM", endTime: "02:00 PM" },
  { id: "5", startTime: "02:00 PM", endTime: "03:00 PM" },
  { id: "6", startTime: "03:00 PM", endTime: "04:00 PM" },
];

interface RescheduleDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRescheduleComplete: () => void;
}

export function RescheduleDialog({
  bookingId,
  open,
  onOpenChange,
  onRescheduleComplete,
}: RescheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlotId, setTimeSlotId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReschedule = async () => {
    if (!date || !timeSlotId) {
      toast.error("Please select both date and time slot");
      return;
    }

    setIsSubmitting(true);
    try {
      await BookingService.rescheduleBooking(bookingId, {
        timeSlotId,
        bookingDate: format(date, "yyyy-MM-dd"),
      });

      toast.success("Booking rescheduled successfully");
      onOpenChange(false);
      onRescheduleComplete();
    } catch (error) {
      toast.error("Failed to reschedule booking");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
          <DialogDescription>
            Select a new date and time slot for this booking.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="timeSlot" className="text-sm font-medium">
              Select Time Slot
            </label>
            <Select onValueChange={setTimeSlotId} value={timeSlotId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReschedule} disabled={isSubmitting}>
            {isSubmitting ? "Rescheduling..." : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
