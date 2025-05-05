import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";

interface FilterBarProps {
  onFilter: (type: string | null, includeInactive: boolean) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const handleTypeChange = (value: string) => {
    const type = value === "all" ? null : value;
    setSelectedType(type);
    onFilter(type, showInactive);
  };

  const handleInactiveChange = (checked: boolean) => {
    setShowInactive(checked);
    onFilter(selectedType, checked);
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Label htmlFor="type-filter" className="text-sm font-medium">
          Filter by Type:
        </Label>
        <Select value={selectedType || "all"} onValueChange={handleTypeChange}>
          <SelectTrigger id="type-filter" className="w-[180px] bg-background">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="experienceLevel">Experience Level</SelectItem>
            <SelectItem value="expertiseArea">Expertise Area</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="show-inactive" className="text-sm font-medium">
          Show Inactive:
        </Label>
        <Switch
          id="show-inactive"
          checked={showInactive}
          onCheckedChange={handleInactiveChange}
        />
      </div>
    </div>
  );
}
