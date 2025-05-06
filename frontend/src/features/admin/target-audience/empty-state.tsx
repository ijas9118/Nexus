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
    <div className="text-center py-12 border rounded-lg bg-muted/60">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-muted-foreground">{message}</p>
      {action && (
        <Button
          variant="link"
          onClick={action.onClick}
          className="mt-2 text-teal-700 dark:text-teal-500"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
