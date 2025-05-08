import { DynamicLucidIcon } from "@/components/organisms/lucide-icon";

interface EmptyStateProps {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
}

export function EmptyState({
  searchQuery,
  typeFilter,
  statusFilter,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <DynamicLucidIcon
        name="Bell"
        className="mx-auto h-12 w-12 text-muted-foreground opacity-50"
      />
      <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
      <p className="text-muted-foreground mt-2">
        {searchQuery || typeFilter !== "all" || statusFilter !== "all"
          ? "Try changing your filters"
          : "You're all caught up!"}
      </p>
    </div>
  );
}
