import { MentorshipConfig } from "@/types/mentor";
import { SelectableCard } from "./selectable-card";

interface CardSelectProps {
  options: MentorshipConfig[];
  selected: string[];
  onChange: (selected: string[]) => void;
  loading: boolean;
}

export function CardSelect({ options, selected, onChange }: CardSelectProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {options.map((option) => (
        <SelectableCard
          key={option._id}
          value={option._id}
          label={option.value}
          selected={selected.includes(option.value)}
          onClick={() => handleToggle(option.value)}
        />
      ))}
    </div>
  );
}
