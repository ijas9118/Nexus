import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/atoms/checkbox";
import { Button } from "@/components/atoms/button";
import type { INotification } from "@/types/notification";
import NotificationService from "@/services/notificationService";
import { toast } from "sonner";
import { DynamicLucidIcon } from "@/components/organisms/lucide-icon";

interface BulkActionsProps {
  selectedIds: string[];
  filteredNotifications: INotification[];
  handleSelectAll: () => void;
}

export function BulkActions({
  selectedIds,
  filteredNotifications,
  handleSelectAll,
}: BulkActionsProps) {
  const queryClient = useQueryClient();

  // Delete multiple notifications mutation
  const deleteMultipleNotificationsMutation = useMutation({
    mutationFn: (ids: string[]) => NotificationService.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("Notifications deleted", {
        description: "The selected notifications have been deleted.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to delete notifications.",
      });
      console.error("Error deleting multiple notifications:", error);
    },
  });

  // Delete selected notifications
  const deleteSelected = () => {
    if (selectedIds.length > 0) {
      deleteMultipleNotificationsMutation.mutate(selectedIds);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-all"
          checked={
            selectedIds.length === filteredNotifications.length &&
            filteredNotifications.length > 0
          }
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium">
          {selectedIds.length === 0
            ? "Select all"
            : selectedIds.length === filteredNotifications.length
              ? "Deselect all"
              : `Selected ${selectedIds.length} of ${filteredNotifications.length}`}
        </label>
      </div>
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={deleteSelected}
          disabled={deleteMultipleNotificationsMutation.isPending}
        >
          <DynamicLucidIcon name="Trash2" className="h-4 w-4 mr-1" />
          Delete selected ({selectedIds.length})
        </Button>
      )}
    </div>
  );
}
