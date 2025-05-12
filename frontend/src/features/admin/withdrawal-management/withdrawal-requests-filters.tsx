import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Calendar } from "@/components/organisms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function WithdrawalRequestsFilters() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by user or note..."
          className="w-full pl-8"
        />
      </div>

      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="money">Money</SelectItem>
          <SelectItem value="nexus">Nexus Points</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal sm:w-[240px]",
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
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
