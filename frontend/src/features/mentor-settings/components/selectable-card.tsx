import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  value: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectableCard({
  value,
  label,
  selected,
  onClick,
}: SelectableCardProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border p-4 text-center transition-all",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-muted bg-background hover:border-muted-foreground/20",
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </div>
      )}
      <div className="mt-2 font-medium">{label}</div>
    </div>
  );
}
