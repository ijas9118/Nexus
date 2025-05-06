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
  value?: string; // Expected format: "hh:mm AM/PM"
  onChange: (time: string) => void;
  disabled?: boolean;
}

const TimeInput: FC<TimeInputProps> = ({
  value = "",
  onChange,
  disabled = false,
}) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Parse the initial value
  useEffect(() => {
    if (value) {
      const [time, ampm] = value.split(" ");
      const [h, m] = time.split(":");
      setHour(h);
      setMinute(m);
      setPeriod(ampm as "AM" | "PM");
    }
  }, [value]);

  // Available values
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  ); // 01 to 12
  const minutes = ["00", "15", "30", "45"];
  const periods: ("AM" | "PM")[] = ["AM", "PM"];

  // Fire onChange when any of the values change
  useEffect(() => {
    if (hour && minute && period) {
      onChange(`${hour}:${minute} ${period}`);
    }
  }, [hour, minute, period, onChange]);

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
            <SelectTrigger className="w-[70px] bg-transparent border-0 focus:ring-transparent font-medium">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((h) => (
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
            <SelectTrigger className="w-[70px] bg-transparent border-0 focus:ring-transparent font-medium">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Select
            value={period}
            onValueChange={(val) => setPeriod(val as "AM" | "PM")}
            disabled={disabled}
          >
            <SelectTrigger className="w-[70px] bg-transparent border-0 focus:ring-transparent font-medium">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimeInput;
