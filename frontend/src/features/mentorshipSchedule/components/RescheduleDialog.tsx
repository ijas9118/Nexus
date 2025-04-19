import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";

type RescheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCall: {
    mentee: {
      name: string;
    };
  } | null;
};

const RescheduleDialog = ({
  open,
  onOpenChange,
  selectedCall,
}: RescheduleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Session</DialogTitle>
          <DialogDescription>
            Select a new date and time for your mentorship session with{" "}
            {selectedCall?.mentee.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Select>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9:00">9:00 AM - 10:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM - 11:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM - 12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM - 2:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM - 3:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM - 4:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM - 5:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for rescheduling (optional)</Label>
            <Input id="reason" placeholder="Enter reason" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
