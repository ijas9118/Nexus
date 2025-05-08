import { useState } from "react";
import { Calendar } from "@/components/organisms/calendar";
import { Button } from "@/components/atoms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { CalendarIcon, FilterX } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// This would typically come from an API or be passed as props
const MENTORSHIP_TYPES = [
  { id: "1", name: "Career Guidance" },
  { id: "2", name: "Technical Skills" },
  { id: "3", name: "Interview Preparation" },
  { id: "4", name: "Resume Review" },
];

interface BookingFiltersProps {
  onFilterChange: (filters: {
    date?: string;
    mentorshipTypeId?: string;
  }) => void;
}

export function BookingFilters({ onFilterChange }: BookingFiltersProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mentorshipTypeId, setMentorshipTypeId] = useState<string | undefined>(
    undefined,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);

    const filters = {
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
      mentorshipTypeId,
    };

    onFilterChange(filters);
  };

  const handleMentorshipTypeSelect = (value: string) => {
    setMentorshipTypeId(value === "all" ? undefined : value);

    const filters = {
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      mentorshipTypeId: value === "all" ? undefined : value,
    };

    onFilterChange(filters);
  };

  const clearFilters = () => {
    setDate(undefined);
    setMentorshipTypeId(undefined);
    onFilterChange({});
  };

  const hasActiveFilters = date !== undefined || mentorshipTypeId !== undefined;

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <div className="flex-1 min-w-[200px]">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select
          onValueChange={handleMentorshipTypeSelect}
          value={mentorshipTypeId || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by mentorship type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All mentorship types</SelectItem>
            {MENTORSHIP_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} className="gap-2">
          <FilterX className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
