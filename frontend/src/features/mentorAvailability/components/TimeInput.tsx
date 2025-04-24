import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";

interface TimeInputProps {
  value?: string;
  onChange: (time: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const TimeInput: FC<TimeInputProps> = ({
  value = "",
  onChange,
  min = "09:00",
  max = "21:00",
  disabled = false,
}) => {
  // Parse the initial value (HH:MM format)
  const [hour, setHour] = useState(value ? value.split(":")[0] : "");
  const [minute, setMinute] = useState(value ? value.split(":")[1] : "");

  // Parse min and max constraints
  const minHour = parseInt(min.split(":")[0]);
  const maxHour = parseInt(max.split(":")[0]);

  // Available hours based on constraints
  const availableHours = Array.from({ length: maxHour - minHour + 1 }, (_, i) =>
    String(i + minHour).padStart(2, "0"),
  );

  // Available minutes (by default: 00, 15, 30, 45)
  const availableMinutes = ["00", "15", "30", "45"];

  // Update parent component when hour or minute changes
  useEffect(() => {
    if (hour && minute) {
      onChange(`${hour}:${minute}`);
    }
  }, [hour, minute, onChange]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <motion.div
      className="flex items-center space-x-2 rounded-lg shadow-sm border p-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-center w-8 h-8 text-muted-foreground"
        variants={itemVariants}
      >
        <Clock className="h-4 w-4" />
      </motion.div>

      <div className="flex items-center">
        <motion.div variants={itemVariants}>
          <Select value={hour} onValueChange={setHour} disabled={disabled}>
            <SelectTrigger className="w-[80px] bg-transparent border-0 focus:ring-transparent font-medium">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {availableHours.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="px-1 text-lg font-medium text-gray-400"
        >
          :
        </motion.div>

        <motion.div variants={itemVariants}>
          <Select value={minute} onValueChange={setMinute} disabled={disabled}>
            <SelectTrigger className="w-[80px] bg-transparent border-0 focus:ring-transparent font-medium">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {availableMinutes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <motion.div
        className="flex items-center justify-center text-xs text-muted-foreground font-medium ml-1 px-2 py-1"
        variants={itemVariants}
      >
        {hour && minute ? (
          <span className="bg-blue-100 dark:bg-blue-800/40 text-blue-800 dark:text-blue-200 px-4 py-1 rounded-full">
            {parseInt(hour) >= 12 ? "PM" : "AM"}
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default TimeInput;
