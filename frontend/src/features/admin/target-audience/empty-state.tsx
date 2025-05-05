import type { ReactNode } from "react";
import { Button } from "@/components/atoms/button";

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export function EmptyState({ message, action, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12 border rounded-lg bg-stone-50">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-muted-foreground">{message}</p>
      {action && (
        <Button
          variant="link"
          onClick={action.onClick}
          className="mt-2 text-amber-700"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
