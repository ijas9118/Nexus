import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";

import { Card, CardContent } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import type {
  INotification,
  NotificationType,
  NotificationTypeData,
} from "@/types/notification";
import NotificationService from "@/services/notificationService";
import { toast } from "sonner";
import { DynamicLucidIcon } from "@/components/organisms/lucide-icon";

const notificationTypes: NotificationTypeData[] = [
  {
    _id: "1",
    name: "System",
    description: "System notifications",
    icon: "Bell",
    iconColor: "#3b82f6",
    roles: ["admin", "user"],
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Message",
    description: "Message notifications",
    icon: "MessageCircle",
    iconColor: "#10b981",
    roles: ["admin", "user"],
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "3",
    name: "Alert",
    description: "Alert notifications",
    icon: "AlertTriangle",
    iconColor: "#ef4444",
    roles: ["admin"],
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
];

function getNotificationType(notificationTypeId: NotificationType) {
  return (
    notificationTypes.find((t) => t._id === notificationTypeId._id) ||
    notificationTypeId
  );
}

function getNotificationTypeName(notificationType: NotificationType) {
  return notificationType.name || "Unknown";
}

interface NotificationItemProps {
  notification: INotification;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

export function NotificationItem({
  notification,
  isSelected,
  onToggleSelection,
}: NotificationItemProps) {
  const queryClient = useQueryClient();

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("Notification marked as read", {
        description: "The notification has been marked as read.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to mark notification as read.",
      });
      console.error("Error marking as read:", error);
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => NotificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("Notification deleted", {
        description: "The notification has been deleted.",
      });
    },
    onError: (error) => {
      toast("Error", {
        description: "Failed to delete notification.",
      });
      console.error("Error deleting notification:", error);
    },
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format("MMM D, YYYY [at] h:mm A");
    } catch {
      return dateString;
    }
  };

  const notificationType = getNotificationType(notification.notificationTypeId);

  return (
    <Card
      className={`transition-colors ${!notification.read ? "border-l-4 border-l-primary border-l-blue-500" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(notification._id)}
              className="mt-1"
            />
            <div className="mt-1 flex-shrink-0 rounded-full bg-muted p-2">
              <DynamicLucidIcon
                name={notificationType.icon || "Bell"}
                color={notificationType.iconColor}
              />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{notification.heading}</h3>
                {!notification.read && <Badge variant="squad">New</Badge>}
                <Badge variant="outline" className="text-xs">
                  {getNotificationTypeName(notification.notificationTypeId)}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem
                      onClick={() =>
                        markAsReadMutation.mutate(notification._id)
                      }
                      disabled={markAsReadMutation.isPending}
                    >
                      <DynamicLucidIcon
                        name="Check"
                        color="green"
                        className="mr-2 h-4 w-4"
                      />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() =>
                      deleteNotificationMutation.mutate(notification._id)
                    }
                    disabled={deleteNotificationMutation.isPending}
                    className="text-destructive"
                  >
                    <DynamicLucidIcon name="Trash2" className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(notification.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
