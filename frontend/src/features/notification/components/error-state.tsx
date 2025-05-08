import { Button } from "@/components/atoms/button";
import { DynamicLucidIcon } from "@/components/organisms/lucide-icon";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <DynamicLucidIcon
        name="AlertTriangle"
        className="mx-auto h-12 w-12 text-destructive opacity-70"
      />
      <h3 className="mt-4 text-lg font-medium">Failed to load notifications</h3>
      <p className="text-muted-foreground mt-2">
        There was an error loading your notifications. Please try again later.
      </p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
