import { motion, Variants } from "motion/react";
import { Trash2, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";

interface TimeSlotListByDateProps {
  timeSlots: any[];
  isLoading: boolean;
  onDelete: (slotId: string) => void;
  isDeleting: boolean;
}

const TimeSlotListByDate = ({
  timeSlots,
  isLoading,
  onDelete,
  isDeleting,
}: TimeSlotListByDateProps) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 12 } },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin h-8 w-8 text-blue-800" />
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <motion.p
        className="text-muted-foreground text-center p-6 rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        No time slots added for this date yet.
      </motion.p>
    );
  }

  return (
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
              <Badge variant="secondary" className="ml-2">
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
                onClick={() => onDelete(slot._id)}
                disabled={isDeleting}
                className="text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default TimeSlotListByDate;
