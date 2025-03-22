import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Search } from "lucide-react";

const SearchAndSort = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search mentors by name or expertise..."
          className="w-full pl-8"
        />
      </div>
      <Select defaultValue="recommended">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="sessions">Most Sessions</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchAndSort;
