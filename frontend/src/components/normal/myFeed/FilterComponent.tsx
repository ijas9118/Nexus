import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";
import React from "react";

interface FilterProps {
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
}

const topics = ["javascript", "react", "nodejs", "next"];

const FilterComponent: React.FC<FilterProps> = ({
  selectedTopics,
  setSelectedTopics,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Choose Topics
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {topics.map((topic) => (
            <DropdownMenuItem
              key={topic}
              onClick={() => {
                if (selectedTopics.includes(topic)) {
                  setSelectedTopics(selectedTopics.filter((t) => t !== topic));
                } else {
                  setSelectedTopics([...selectedTopics, topic]);
                }
              }}
            >
              {topic}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTopics.map((topic) => (
        <Badge
          key={topic}
          variant="default"
          className="gap-1 px-3 py-1"
          onClick={() =>
            setSelectedTopics(selectedTopics.filter((t) => t !== topic))
          }
        >
          {topic}
          <span className="cursor-pointer">&times;</span>
        </Badge>
      ))}
    </div>
  );
};

export default FilterComponent;
