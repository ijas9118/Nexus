import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import NotificationTypeService from "@/services/notificationTypeService";
import type {
  NotificationTypeData,
  NotificationTypeFormValues,
} from "@/types/notification";

import NotificationTypeDialog from "./notification-type-dialog";
import NotificationTypeList from "./notification-type-list";

export default function NotificationTypeManagement() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [editingNotificationType, setEditingNotificationType] =
    useState<NotificationTypeData | null>(null);

  // Fetch notification types
  const {
    data: notificationTypes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notificationTypes"],
    queryFn: NotificationTypeService.getAllTypes,
  });

  // Mutation for creating a notification type
  const createMutation = useMutation({
    mutationFn: NotificationTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationTypes"] });
      setIsCreateDialogOpen(false);
    },
  });

  // Mutation for updating a notification type
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NotificationTypeData>;
    }) => NotificationTypeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationTypes"] });
      setEditingNotificationType(null);
    },
  });

  // Mutation for soft deleting (deactivating) a notification type
  const softDeleteMutation = useMutation({
    mutationFn: NotificationTypeService.softDelete,
    onSuccess: (updatedType) => {
      queryClient.setQueryData(
        ["notificationTypes"],
        (old: NotificationTypeData[] | undefined) =>
          old?.map((item) =>
            item._id === updatedType._id ? updatedType : item,
          ),
      );
      toast.success("Notification type deactivated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to deactivate notification type";
      toast.error(errorMessage);
    },
  });

  // Mutation for restoring (activating) a notification type
  const restoreMutation = useMutation({
    mutationFn: NotificationTypeService.restore,
    onSuccess: (updatedType) => {
      queryClient.setQueryData(
        ["notificationTypes"],
        (old: NotificationTypeData[] | undefined) =>
          old?.map((item) =>
            item._id === updatedType._id ? updatedType : item,
          ),
      );
      toast.success("Notification type activated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to activate notification type";
      toast.error(errorMessage);
    },
  });

  const handleCreateNotificationType = async (
    notificationType: NotificationTypeFormValues,
  ) => {
    await createMutation.mutateAsync(notificationType);
  };

  const handleUpdateNotificationType = async (
    formData: NotificationTypeFormValues,
  ) => {
    if (!editingNotificationType) return;
    await updateMutation.mutateAsync({
      id: editingNotificationType._id,
      data: formData,
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    if (isActive) {
      softDeleteMutation.mutate(id);
    } else {
      restoreMutation.mutate(id);
    }
  };

  const handleEditClick = (notificationType: NotificationTypeData) => {
    setEditingNotificationType(notificationType);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Notification Types</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Type
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">
          Loading notification types...
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          Error loading notification types: {error?.message || "Unknown error"}
        </div>
      ) : notificationTypes.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No notification types found
        </div>
      ) : (
        <NotificationTypeList
          notificationTypes={notificationTypes}
          onEdit={handleEditClick}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* Create Dialog */}
      <NotificationTypeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateNotificationType}
        title="Create Notification Type"
      />

      {/* Edit Dialog */}
      <NotificationTypeDialog
        open={!!editingNotificationType}
        onOpenChange={(open: boolean) =>
          !open && setEditingNotificationType(null)
        }
        initialData={editingNotificationType}
        onSubmit={handleUpdateNotificationType}
        title="Edit Notification Type"
        isEditing
      />
    </div>
  );
}
