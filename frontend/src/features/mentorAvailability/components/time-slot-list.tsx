import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Trash2, Clock, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { TimeSlot } from "@/types/mentor";
import TimeSlotService from "@/services/TimeSlotService";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export default function TimeSlotList() {
  const queryClient = useQueryClient();

  // Fetch all time slots using useQuery
  const {
    data: timeSlots = [],
    isLoading,
    error,
  } = useQuery<TimeSlot[]>({
    queryKey: ["allTimeSlots"],
    queryFn: () => TimeSlotService.getAllTimeSlots(), // Assume this method exists in TimeSlotService
  });

  // Mutation for deleting a time slot
  const deleteTimeSlotMutation = useMutation({
    mutationFn: (slotId: string) => TimeSlotService.deleteTimeSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTimeSlots"] });
    },
    onError: (err: any) => {
      console.error("Failed to delete time slot:", err);
    },
  });

  // Group time slots by date
  const groupedTimeSlots = timeSlots.reduce(
    (groups, slot) => {
      const date = format(parseISO(slot.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    },
    {} as Record<string, TimeSlot[]>,
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const slotVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", damping: 12 },
    },
    exit: {
      opacity: 0,
      x: 15,
      transition: { duration: 0.15 },
    },
  };

  if (isLoading && timeSlots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-40 space-y-4"
      >
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">
          Loading time slots...
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" }}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading time slots:{" "}
            {(error as Error).message || "Please try again."}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
      >
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Clock className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-muted-foreground text-center">
            No time slots found.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-370px)] w-full overflow-hidden">
      <motion.div
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {Object.entries(groupedTimeSlots)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, slots], index) => (
              <motion.div
                key={date}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                layout
              >
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <motion.div
                    className="bg-muted px-3 py-2 text-sm font-medium"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  >
                    {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                  </motion.div>
                  <CardContent className="p-3">
                    <motion.ul className="space-y-2">
                      <AnimatePresence>
                        {slots
                          .sort((a, b) =>
                            a.startTime.localeCompare(b.startTime),
                          )
                          .map((slot) => (
                            <motion.li
                              key={slot._id}
                              variants={slotVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                              className="flex items-center justify-between p-2 border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                            >
                              <div className="flex items-center space-x-2">
                                <motion.div
                                  whileHover={{ rotate: 30 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                  }}
                                >
                                  <Clock className="h-4 w-4 text-blue-500" />
                                </motion.div>
                                <span className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                {slot.isBooked && (
                                  <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring" }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="animate-pulse"
                                    >
                                      Booked
                                    </Badge>
                                  </motion.div>
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
                                    onClick={() =>
                                      deleteTimeSlotMutation.mutate(slot._id)
                                    }
                                    disabled={deleteTimeSlotMutation.isPending}
                                    className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              )}
                            </motion.li>
                          ))}
                      </AnimatePresence>
                    </motion.ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}
