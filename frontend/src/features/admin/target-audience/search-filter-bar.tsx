import { Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showInactive: boolean;
  onShowInactiveChange: (value: boolean) => void;
  searchPlaceholder?: string;
  toggleLabel?: string;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  showInactive,
  onShowInactiveChange,
  searchPlaceholder = "Search...",
  toggleLabel = "Show inactive",
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-stone-200 focus-visible:ring-amber-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="toggle-filter"
          checked={showInactive}
          onCheckedChange={onShowInactiveChange}
          className="data-[state=checked]:bg-amber-700"
        />
        <Label htmlFor="toggle-filter" className="text-sm">
          {toggleLabel}
        </Label>
      </div>
    </div>
  );
}
