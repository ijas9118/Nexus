import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import NotificationService from "@/services/notificationService";
import { toast } from "sonner";
import { DynamicLucidIcon } from "@/components/organisms/lucide-icon";

interface NotificationHeaderProps {
  unreadCount: number;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  userId: string;
}

export function NotificationHeader({
  unreadCount,
  isFilterOpen,
  setIsFilterOpen,
  userId,
}: NotificationHeaderProps) {
  const queryClient = useQueryClient();

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("All notifications marked as read", {
        description: "All notifications have been marked as read.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to mark all notifications as read.",
      });
      console.error("Error marking all as read:", error);
    },
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          You have {unreadCount} unread notification
          {unreadCount !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <DynamicLucidIcon name="Check" className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <DynamicLucidIcon name="Trash2" className="h-4 w-4 mr-1" />
              Delete all
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all notifications?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your notifications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // This would be implemented with a deleteAll mutation
                  toast("All notifications deleted", {
                    description: "All notifications have been deleted.",
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["notifications"],
                  });
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
